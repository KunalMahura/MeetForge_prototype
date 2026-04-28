import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { Play, Lock, ChevronLeft, Loader2 } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { StreamVideo, StreamVideoClient, StreamCall, CallControls, StreamTheme, ParticipantView, useCallStateHooks, hasScreenShare } from '@stream-io/video-react-sdk';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, Window, MessageList, MessageComposer } from 'stream-chat-react';
import io from 'socket.io-client';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'stream-chat-react/dist/css/index.css';

// Custom video layout: big remote video, small local PiP, screen share takes priority
function CustomVideoLayout() {
  const { useLocalParticipant, useRemoteParticipants, useParticipants } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const allParticipants = useParticipants();

  const remoteParticipant = remoteParticipants[0];

  // Find whoever is screen sharing (could be local or remote)
  const screenSharingParticipant = allParticipants.find(p => hasScreenShare(p));

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* === MAIN STAGE === */}
      {screenSharingParticipant ? (
        // Screen share takes over the main stage
        <div className="w-full h-full">
          <ParticipantView
            participant={screenSharingParticipant}
            trackType="screenShareTrack"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full border border-white/10 backdrop-blur-sm">
            📺 Screen Share
          </div>
        </div>
      ) : remoteParticipant ? (
        // Remote participant is the main stage
        <div className="w-full h-full">
          <ParticipantView
            participant={remoteParticipant}
            trackType="videoTrack"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        // No one else in room
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
              <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.72v6.56a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
            <p className="text-white/30 text-sm">Waiting for someone to join...</p>
          </div>
        </div>
      )}

      {/* === LOCAL PiP (bottom-right corner, small like a real video call) === */}
      {localParticipant && (
        <div className="absolute bottom-14 right-2 w-24 h-16 rounded-lg overflow-hidden border border-white/20 shadow-2xl z-30 bg-black">
          <ParticipantView
            participant={localParticipant}
            trackType="videoTrack"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center py-0.5 truncate px-1">
            You
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { userId } = useAuth();

  const [code, setCode] = useState('// Write your solution here...');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const [activeTab, setActiveTab] = useState('output');
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

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
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        
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
        try {
          await myCall.join({ create: true });
        } catch (videoErr) {
          console.warn("Video join failed (permissions denied?), continuing without video...", videoErr);
        }
        
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
        newSocket = io(window.location.origin, { path: '/socket.io' });
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

  const handleSendAiMessage = async (e) => {
    e?.preventDefault();
    if (!aiInput.trim()) return;

    const newMessage = { role: 'user', content: aiInput };
    setAiMessages(prev => [...prev, newMessage]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...aiMessages, newMessage],
          currentCode: code,
          language: selectedLanguage
        })
      });
      const data = await response.json();
      if (data.success) {
        setAiMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      }
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to AI server.' }]);
    } finally {
      setIsAiLoading(false);
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
          <div className="w-[400px] lg:w-[450px] min-w-[300px] border-r border-white/5 flex flex-col bg-[#0f0f13] backdrop-blur-sm z-20 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
            <div className="h-[45%] p-2 border-b border-white/5 relative bg-black/50 overflow-hidden">
              <StreamVideo client={videoClient}>
                <StreamCall call={call}>
                  <StreamTheme className="h-full w-full flex flex-col">
                    <CustomVideoLayout />
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

            {/* Terminal/Output/AI window */}
            <div className="h-1/3 min-h-[250px] bg-[#0d0d0d] border-t border-white/5 p-4 font-mono shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] flex flex-col">
              <div className="flex items-center mb-3 space-x-4 border-b border-white/10 pb-2">
                <button 
                  onClick={() => setActiveTab('output')}
                  className={`text-xs uppercase tracking-wider font-bold transition ${activeTab === 'output' ? 'text-theme-yellow' : 'text-white/40 hover:text-white/60'}`}
                >
                  Output Console
                </button>
                <button 
                  onClick={() => setActiveTab('ai')}
                  className={`text-xs uppercase tracking-wider font-bold transition flex items-center gap-1 ${activeTab === 'ai' ? 'text-indigo-400' : 'text-white/40 hover:text-white/60'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  AI Assistant
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                {activeTab === 'output' ? (
                  <pre className="text-white/70 text-sm whitespace-pre-wrap">{output || 'Code output will appear here...'}</pre>
                ) : (
                  <div className="flex flex-col h-full font-sans">
                    <div className="flex-1 overflow-y-auto space-y-3 pb-2 pr-2">
                      {aiMessages.length === 0 ? (
                        <p className="text-white/40 text-sm italic">Ask the AI a question about your code. It has full context of what you're working on!</p>
                      ) : (
                        aiMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-xl p-3 text-sm ${msg.role === 'user' ? 'bg-indigo-600/30 border border-indigo-500/30 text-white' : 'bg-white/5 border border-white/10 text-white/80'}`}>
                              <span className="text-[10px] uppercase font-bold opacity-50 block mb-1">{msg.role}</span>
                              <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                          </div>
                        ))
                      )}
                      {isAiLoading && (
                         <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/10 text-white/80 rounded-xl p-3 text-sm flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> Thinking...
                            </div>
                         </div>
                      )}
                    </div>
                    <form onSubmit={handleSendAiMessage} className="mt-2 flex gap-2 pt-2 border-t border-white/5">
                      <input 
                        type="text" 
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask about your code..." 
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button 
                        type="submit"
                        disabled={isAiLoading || !aiInput.trim()}
                        className="px-4 py-2 bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-lg border border-indigo-500/30 hover:bg-indigo-500/30 transition disabled:opacity-50"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
