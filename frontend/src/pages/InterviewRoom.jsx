import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { Play, Lock, ChevronLeft } from 'lucide-react';

export default function InterviewRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('// Write your solution here...');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Boilerplate function to handle code execution via backend Piston API
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const language_id = document.getElementById("language-select").value;
      const response = await fetch('http://localhost:5000/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_code: code, language_id: parseInt(language_id) })
      });
      const data = await response.json();
      setOutput(data.run?.output || data.compile?.output || data.error || 'Execution finished without output.');
    } catch (error) {
      setOutput('Failed to connect to code runner.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden text-white relative selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white/[0.02] backdrop-blur-md border-b border-white/5">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/10 rounded-md transition text-white/60 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Interview Session</h1>
              <p className="text-xs text-white/40 font-mono">ID: {roomId}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Simulated locking logic indicator */}
            <div className="flex items-center text-xs font-semibold px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 backdrop-blur-sm">
              <Lock className="w-3 h-3 mr-1" /> Room Locked
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left pane: Video/Chat (Placeholder for Stream SDK) */}
          <div className="w-1/3 min-w-[300px] border-r border-white/5 flex flex-col bg-black/40 backdrop-blur-sm">
            <div className="flex-1 p-4 flex items-center justify-center border-b border-white/5">
              <div className="text-center w-full">
                <p className="text-sm text-white/40 mb-2">Stream Video SDK Target Area</p>
                <div className="w-full aspect-video bg-white/[0.02] rounded-xl flex items-center justify-center border border-dashed border-white/10 shadow-inner">
                  <span className="text-white/60">Host Video</span>
                </div>
                <div className="w-full aspect-video bg-white/[0.02] rounded-xl flex items-center justify-center border border-dashed border-white/10 mt-4 shadow-inner">
                  <span className="text-white/60">Guest Video</span>
                </div>
              </div>
            </div>
            <div className="h-64 p-4 text-center text-white/40 flex items-center justify-center bg-white/[0.01]">
              Stream Chat SDK Target Area
            </div>
          </div>

          {/* Right pane: Monaco Editor & Output */}
          <div className="flex-1 flex flex-col bg-black">
            {/* Editor Header */}
            <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 flex justify-between items-center backdrop-blur-sm">
              <select id="language-select" className="bg-white/5 text-white/80 text-sm border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="93" className="bg-black">JavaScript (Node.js 18)</option>
                <option value="71" className="bg-black">Python (3.11)</option>
                <option value="62" className="bg-black">Java (13)</option>
              </select>
              <button 
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center px-4 py-1.5 bg-indigo-600/20 text-indigo-400 text-sm font-medium rounded-lg border border-indigo-500/30 hover:bg-indigo-600/30 transition disabled:opacity-50"
              >
                {isRunning ? 'Running...' : <><Play className="w-4 h-4 mr-1" /> Run Code</>}
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                theme="vs-dark"
                language="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, monospace',
                  padding: { top: 16 }
                }}
              />
            </div>

            {/* Terminal/Output window */}
            <div className="h-1/3 min-h-[150px] bg-[#0d0d0d] border-t border-white/5 p-4 font-mono shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
              <div className="flex items-center mb-3">
                <div className="text-indigo-400/80 text-xs uppercase tracking-wider font-bold">Output Console</div>
              </div>
              <pre className="text-white/70 text-sm whitespace-pre-wrap">{output || 'Code output will appear here...'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
