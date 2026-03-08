// Integrates with Judge0 API to run code
export const executeCode = async (req, res) => {
  const { source_code, language_id } = req.body;

  if (!source_code || !language_id) {
    return res.status(400).json({ error: 'Source code and language_id are required' });
  }

  const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

  if (!JUDGE0_API_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration: Missing JUDGE0_API_KEY' });
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': JUDGE0_API_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    },
    body: JSON.stringify({
      language_id: language_id,
      source_code: source_code,
      stdin: ''
    })
  };

  try {
    // 1. Submit Code for Execution
    const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*', options);
    const submitData = await submitResponse.json();

    if (!submitResponse.ok) {
      return res.status(submitResponse.status).json({ error: submitData.message || 'Error submitting code to Judge0' });
    }

    const { token } = submitData;

    // 2. Poll for Results
    let resultData;
    let isProcessing = true;
    let attempts = 0;
    const MAX_ATTEMPTS = 15; // 15 seconds max

    while (isProcessing && attempts < MAX_ATTEMPTS) {
      // Wait 1 second before polling
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pollResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });
      
      resultData = await pollResponse.json();
      
      // Status ID 1 = In Queue, 2 = Processing. Any other status means it's done.
      if (resultData.status?.id !== 1 && resultData.status?.id !== 2) {
        isProcessing = false;
      }
      attempts++;
    }

    if (isProcessing) {
      return res.status(408).json({ error: 'Execution payload timed out. Try again.' });
    }

    // 3. Format result backwards compatible with existing frontend logic
    // Judge0 provides stdout (normal output), stderr (errors), compile_output (compilation errors), or message
    let outputString = resultData.stdout || resultData.stderr || resultData.compile_output || resultData.message || 'Execution finished without output.';

    res.status(200).json({
      run: {
        output: outputString
      }
    });

  } catch (error) {
    console.error('Judge0 Code execution error:', error);
    res.status(500).json({ error: 'Failed to communicate with code runner backend' });
  }
};
