import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';
import crypto from 'crypto';

const execAsync = promisify(exec);

// Integrates with local system to run code
export const executeCode = async (req, res) => {
  const { source_code, language } = req.body;

  if (!source_code || !language) {
    return res.status(400).json({ error: 'Source code and language are required' });
  }

  // Determine file extension and command based on language
  let ext = '';
  let cmdPrefix = '';
  const runtimeLanguage = language.toLowerCase();
  
  if (runtimeLanguage === 'javascript' || runtimeLanguage === 'js') {
    ext = 'js';
    cmdPrefix = 'node';
  } else if (runtimeLanguage === 'python' || runtimeLanguage === 'py') {
    ext = 'py';
    cmdPrefix = 'python'; // Might need to be 'python3' on some systems
  } else if (runtimeLanguage === 'java') {
    ext = 'java';
    // Java requires the file name to match the public class name, 
    // but for simple scripts we can use Java 11+ single-file source-code programs feature.
    cmdPrefix = 'java'; 
  } else {
     return res.status(400).json({ error: 'Unsupported language' });
  }

  // Create a temporary file
  const tempDir = os.tmpdir();
  const fileId = crypto.randomBytes(8).toString('hex');
  const filename = runtimeLanguage === 'java' ? 'Main.java' : `script_${fileId}.${ext}`;
  
  // For Java, it's safer to create a unique directory since the filename must be Main.java
  const workDir = path.join(tempDir, `exec_${fileId}`);
  const filePath = path.join(workDir, filename);

  try {
    // Ensure working directory exists
    if (!fs.existsSync(workDir)){
      fs.mkdirSync(workDir, { recursive: true });
    }

    // Write source code to file
    fs.writeFileSync(filePath, source_code);

    // Execute the code
    // We add a timeout of 10 seconds to prevent infinite loops
    const command = `${cmdPrefix} "${filePath}"`;
    const { stdout, stderr } = await execAsync(command, { timeout: 10000, cwd: workDir });

    // Format result backwards compatible with existing frontend logic
    let outputString = stdout;
    if (stderr) {
       outputString += `\nError Output:\n${stderr}`;
    }
    
    if (!outputString.trim()) {
        outputString = 'Execution finished without output.';
    }

    res.status(200).json({
      run: {
        output: outputString
      }
    });

  } catch (error) {
    // If the error comes from execAsync (like syntax error or timeout), it has stdout/stderr properties
    if (error.stdout || error.stderr) {
         let errorOutput = '';
         if (error.stdout) errorOutput += error.stdout + '\n';
         if (error.stderr) errorOutput += error.stderr;
         
         if (error.killed) {
             errorOutput += '\nExecution timed out (10 seconds limit).';
         }

         return res.status(200).json({
            run: {
              output: errorOutput || 'Execution failed.'
            }
         });
    }
    
    console.error('Local Code execution error:', error);
    res.status(500).json({ error: 'Failed to execute code locally' });
  } finally {
     // Cleanup: delete the working directory and its contents
     try {
       if (fs.existsSync(workDir)) {
          fs.rmSync(workDir, { recursive: true, force: true });
       }
     } catch (cleanupError) {
         console.error('Failed to cleanup temp files:', cleanupError);
     }
  }
};
