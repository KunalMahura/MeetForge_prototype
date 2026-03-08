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
      const response = await fetch('http://localhost:5000/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_code: code, language: 'javascript' })
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
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-700 rounded-md transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="font-bold text-lg">Interview Session</h1>
            <p className="text-xs text-gray-400 font-mono">ID: {roomId}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Simulated locking logic indicator */}
          <div className="flex items-center text-xs font-semibold px-3 py-1 bg-green-900/40 text-green-400 rounded-full border border-green-800">
            <Lock className="w-3 h-3 mr-1" /> Room Locked
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left pane: Video/Chat (Placeholder for Stream SDK) */}
        <div className="w-1/3 min-w-[300px] border-r border-gray-700 flex flex-col bg-gray-800/50">
          <div className="flex-1 p-4 flex items-center justify-center border-b border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Stream Video SDK Target Area</p>
              <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center border border-dashed border-gray-600">
                Host Video
              </div>
              <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center border border-dashed border-gray-600 mt-4">
                Guest Video
              </div>
            </div>
          </div>
          <div className="h-64 p-4 text-center text-gray-400 flex items-center justify-center">
            Stream Chat SDK Target Area
          </div>
        </div>

        {/* Right pane: Monaco Editor & Output */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex justify-between items-center">
            <select className="bg-gray-700 text-sm border-none rounded px-2 py-1 focus:ring-0">
              <option value="javascript">JavaScript (Node)</option>
              <option value="python">Python 3</option>
              <option value="java">Java</option>
            </select>
            <button 
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition disabled:opacity-50"
            >
              {isRunning ? 'Running...' : <><Play className="w-4 h-4 mr-1" /> Run Code</>}
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
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
          <div className="h-1/3 min-h-[150px] bg-black border-t border-gray-700 p-4 font-mono">
            <div className="flex items-center mb-2">
              <div className="text-gray-400 text-xs uppercase tracking-wider font-bold">Output</div>
            </div>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap">{output || 'Code output will appear here...'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
