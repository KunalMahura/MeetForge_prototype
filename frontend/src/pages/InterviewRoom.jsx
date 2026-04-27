import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { Play, Lock, ChevronLeft, Loader2 } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { StreamVideo, StreamVideoClient, StreamCall, SpeakerLayout, CallControls, StreamTheme } from '@stream-io/video-react-sdk';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, Window, MessageList, MessageComposer } from 'stream-chat-react';
import io from 'socket.io-client';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'stream-chat-react/dist/css/index.css';

export default function InterviewRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { userId } = useAuth();

  const [code, setCode] = useState('// Write your solution here...');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);
  const [videoClient, setVideoClient] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [call, setCall] = useState(null);
  const [channel, setChannel] = useState(null);
  const [socket, setSocket] = useState(null);
  const [setupError, setSetupError] = useState(null);
  const [loadingStep, setLoadingStep] = useState('Initializing...');

  useEffect(() => {
    if (!isLoaded || !userId || !user) return;

    let vClient, cClient, newSocket;

    const setupRoom = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        
        // 1. Join room and check access
        setLoadingStep('Joining room on backend...');
        const joinRes = await fetch(`${backendUrl}/api/interviews/${roomId}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId,
            email: user?.primaryEmailAddress?.emailAddress || 'unknown@example.com',
            username: user?.username || user?.firstName || 'User',
            imageUrl: user?.imageUrl
          })
        });
        const joinData = await joinRes.json();
        
        if (!joinData.success) {
          alert(joinData.error || 'Cannot join room');
          navigate('/');
          return;
        }
        setHasAccess(true);

        // 2. Fetch Stream Token
        setLoadingStep('Fetching Stream token...');
        const tokenRes = await fetch(`${backendUrl}/api/interviews/token?userId=${userId}`);
        const tokenData = await tokenRes.json();
        const token = tokenData.token;

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;

        // 3. Setup Stream Video Client
        setLoadingStep('Initializing Stream Video...');
        const userObj = { id: userId, name: user.fullName || user.username || userId, image: user.imageUrl || '' };
        vClient = new StreamVideoClient({ apiKey, user: userObj, token });
        
        setLoadingStep('Joining video call...');
        const myCall = vClient.call('default', roomId);
        await myCall.join({ create: true });
        
        setVideoClient(vClient);
        setCall(myCall);

        // 4. Setup Stream Chat Client
        setLoadingStep('Initializing Stream Chat...');
        cClient = StreamChat.getInstance(apiKey);
        
        setLoadingStep('Connecting user to chat...');
        await cClient.connectUser(userObj, token);
        
        setLoadingStep('Joining chat channel...');
        const myChannel = cClient.channel('livestream', roomId, { name: `Interview ${roomId}` });
        await myChannel.watch();
        
        setChatClient(cClient);
        setChannel(myChannel);

        // 5. Setup Socket.io
        setLoadingStep('Connecting WebSocket...');
        newSocket = io(backendUrl);
        newSocket.emit('join-room', roomId);
        
        newSocket.on('receive-code-change', (newCode) => {
          setCode(newCode);
        });
        
        newSocket.on('receive-code-output', (newOutput) => {
          setOutput(newOutput);
        });
        
        setSocket(newSocket);

      } catch (err) {
        console.error("Setup failed:", err);
        setSetupError(err.message || String(err));
      }
    };

    setupRoom();

    return () => {
      if (vClient) vClient.disconnectUser();
      if (cClient) cClient.disconnectUser();
      if (newSocket) newSocket.disconnect();
    };
  }, [isLoaded, userId, user, roomId, navigate]);

  const handleCodeChange = (value) => {
    const val = value || '';
    setCode(val);
    if (socket) {
      socket.emit('code-change', { roomId, code: val });
    }
  };

  // Boilerplate function to handle code execution via backend Piston API
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const language = selectedLanguage;
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/code/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_code: code, language })
      });
      const data = await response.json();
      const newOutput = data.run?.output || data.compile?.output || data.error || 'Execution finished without output.';
      setOutput(newOutput);
      if (socket) {
        socket.emit('code-output', { roomId, output: newOutput });
      }
    } catch (error) {
      setOutput('Failed to connect to code runner.');
    } finally {
      setIsRunning(false);
    }
  };

  if (setupError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="text-theme-red font-bold mb-2">Error Setup Failed</div>
        <p className="text-white/60 max-w-md text-center">{setupError}</p>
      </div>
    );
  }

  if (!hasAccess || !videoClient || !chatClient || !call || !channel) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin w-12 h-12 mb-4 text-theme-red" />
        <p className="text-white/60">{loadingStep}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden text-white relative selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-theme-red/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-theme-orange/5 blur-[120px]" />
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
          {/* Left pane: Video/Chat */}
          <div className="w-[400px] min-w-[300px] border-r border-white/5 flex flex-col bg-[#0f0f13] backdrop-blur-sm z-20 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
            <div className="h-1/2 p-2 border-b border-white/5 relative bg-black/50 overflow-hidden">
              <StreamVideo client={videoClient}>
                <StreamCall call={call}>
                  <StreamTheme className="h-full w-full flex flex-col">
                    <SpeakerLayout participantsBarPosition="bottom" />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-xl">
                      <CallControls />
                    </div>
                  </StreamTheme>
                </StreamCall>
              </StreamVideo>
            </div>
            <div className="flex-1 flex flex-col stream-chat-theme">
              <Chat client={chatClient} theme="str-chat__theme-dark">
                <Channel channel={channel}>
                  <Window>
                    <MessageList />
                    <MessageComposer />
                  </Window>
                </Channel>
              </Chat>
            </div>
          </div>

          {/* Right pane: Monaco Editor & Output */}
          <div className="flex-1 flex flex-col bg-black">
            {/* Editor Header */}
            <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 flex justify-between items-center backdrop-blur-sm">
              <select 
                id="language-select" 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white/5 text-white/80 text-sm border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-theme-red"
              >
                <option value="javascript" className="bg-black">JavaScript (Node.js)</option>
                <option value="python" className="bg-black">Python (3)</option>
                <option value="java" className="bg-black">Java</option>
              </select>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center px-4 py-1.5 bg-theme-red/20 text-theme-red text-sm font-medium rounded-lg border border-theme-red/30 hover:bg-theme-red/30 transition disabled:opacity-50"
              >
                {isRunning ? 'Running...' : <><Play className="w-4 h-4 mr-1" /> Run Code</>}
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                theme="vs-dark"
                language={selectedLanguage}
                value={code}
                onChange={handleCodeChange}
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
                <div className="text-theme-yellow/80 text-xs uppercase tracking-wider font-bold">Output Console</div>
              </div>
              <pre className="text-white/70 text-sm whitespace-pre-wrap">{output || 'Code output will appear here...'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
