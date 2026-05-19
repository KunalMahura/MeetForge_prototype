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
    // Use python3 on Linux (Render), python on Windows
    cmdPrefix = process.platform === 'win32' ? 'python' : 'python3';
  } else if (runtimeLanguage === 'java') {
    const windowsJavaPath = 'C:\\Program Files\\Microsoft\\jdk-17.0.18.8-hotspot\\bin\\java.exe';
    const javaAvailable = process.platform === 'win32'
      ? fs.existsSync(windowsJavaPath)
      : (() => { try { require('child_process').execSync('java -version', { stdio: 'ignore' }); return true; } catch { return false; } })();

    if (!javaAvailable) {
      return res.status(200).json({
        run: {
          output: '❌ Java is not available on this server.\n\nPlease use JavaScript or Python — both are fully supported.\nIf you need Java execution, a Judge0 API integration is required.'
        }
      });
    }

    ext = 'java';
    cmdPrefix = process.platform === 'win32' ? `"${windowsJavaPath}"` : 'java';
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
        outputString = 'Execution finished without output.\n\n💡 Tip: Since this is a raw execution environment, make sure to add console.log() or print() statements at the bottom of your code to see the result of your function calls!';
    }

    res.status(200).json({
      run: {
        output: outputString
      }
    });

  } catch (error) {
    // If the error comes from execAsync (like syntax error, missing command, or timeout)
    let errorOutput = '';
    
    if (error.stdout) errorOutput += error.stdout + '\n';
    if (error.stderr) errorOutput += error.stderr;
    
    if (error.killed) {
        errorOutput += '\n⏳ Execution timed out (10 seconds limit). Infinite loop detected?';
    }

    if (!errorOutput && error.message) {
        errorOutput = error.message;
    }

    // Always return 200 so the frontend displays the error in the terminal instead of crashing
    return res.status(200).json({
       run: {
         output: errorOutput || '❌ Execution failed unexpectedly.'
       }
    });
    
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
