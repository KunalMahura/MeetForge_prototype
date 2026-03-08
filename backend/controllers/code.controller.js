// Integrates with Piston API to run code (https://github.com/engineer-man/piston)
export const executeCode = async (req, res) => {
  const { source_code, language, version } = req.body;

  if (!source_code || !language) {
    return res.status(400).json({ error: 'Source code and language are required' });
  }

  // Piston API requires a specific structure
  const payload = {
    language,
    version: version || '*', // '*' tells piston to use the latest version available
    files: [
      {
        content: source_code,
      },
    ],
  };

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Error executing code' });
    }

    res.status(200).json({
      run: data.run,
      compile: data.compile,
    });
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ error: 'Failed to communicate with code runner' });
  }
};
