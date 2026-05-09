import React, { useState, useEffect, Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { Play, Lock, ChevronLeft, Loader2, VideoOff, Code2, Send, Sparkles, Terminal } from 'lucide-react';
import Logo from '../components/Logo';
import { useUser, useAuth } from '@clerk/clerk-react';
import { StreamVideo, StreamVideoClient, StreamCall, CallControls, StreamTheme, SpeakerLayout } from '@stream-io/video-react-sdk';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, Window, MessageList, MessageComposer } from 'stream-chat-react';
import io from 'socket.io-client';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'stream-chat-react/dist/css/index.css';

// Error Boundary to catch Stream SDK crashes (e.g. camera/mic on insecure HTTP)
class VideoErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.warn('Video component crashed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-surface-muted text-ink p-4 rounded-2xl">
          <VideoOff className="w-10 h-10 text-ink-faint mb-3" />
          <p className="text-ink-muted text-sm text-center">Video unavailable.</p>
          <p className="text-ink-faint text-xs text-center mt-1">Camera/mic require HTTPS or localhost.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-4 py-1.5 text-xs bg-accent-green/10 text-accent-green hover:bg-accent-green/20 rounded-lg border border-accent-green/20 transition font-medium"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
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
        newSocket = io(backendUrl, { path: '/socket.io' });
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

  /* ================ LOADING / ERROR STATES ================ */

  if (setupError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-surface text-ink">
        <div className="rounded-3xl bg-surface-raised border border-black/[0.06] shadow-premium-lg p-10 max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <VideoOff className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">Setup Failed</h2>
          <p className="text-ink-muted text-sm leading-relaxed">{setupError}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2.5 text-sm font-semibold text-white bg-ink rounded-full hover:bg-ink/90 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess || !videoClient || !chatClient || !call || !channel) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-surface text-ink">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent-green/10 flex items-center justify-center">
            <Loader2 className="animate-spin w-8 h-8 text-accent-green" />
          </div>
          <p className="text-ink-muted font-medium">{loadingStep}</p>
        </div>
      </div>
    );
  }

  /* ================ MAIN INTERVIEW UI ================ */

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden text-ink relative selection:bg-accent-green/20">

      {/* ===== HEADER ===== */}
      <header className="flex justify-between items-center px-5 py-3 bg-surface-raised border-b border-black/[0.06] shadow-sm z-30">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-surface-muted rounded-xl transition text-ink-muted hover:text-ink mr-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <Logo />
          <div className="ml-4 border-l border-black/[0.06] pl-4">
             <p className="text-[11px] text-ink-faint font-mono leading-none">SESSION ID</p>
             <p className="text-xs font-bold text-ink leading-tight">{roomId}</p>
          </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center text-xs font-semibold px-3 py-1.5 bg-accent-green/10 text-accent-green rounded-full border border-accent-green/20">
            <Lock className="w-3 h-3 mr-1.5" /> Room Locked
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT PANEL — Video + Chat */}
        <div className="w-[380px] lg:w-[420px] min-w-[300px] border-r border-black/[0.06] flex flex-col bg-surface-raised z-20">

          {/* Video Area */}
          <div className="h-[55%] border-b border-black/[0.06] relative overflow-hidden bg-surface-muted p-3">
            <div className="h-full w-full rounded-2xl overflow-hidden bg-surface-muted relative">
              <VideoErrorBoundary>
                <StreamVideo client={videoClient}>
                  <StreamCall call={call}>
                    <StreamTheme className="h-full w-full">
                      <div className="h-[calc(100%-52px)] w-full rounded-t-2xl overflow-hidden">
                        <SpeakerLayout />
                      </div>
                      <div className="h-[52px] flex items-center justify-center bg-surface-raised border-t border-black/[0.06] rounded-b-2xl">
                        <CallControls onLeave={() => navigate('/')} />
                      </div>
                    </StreamTheme>
                  </StreamCall>
                </StreamVideo>
              </VideoErrorBoundary>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden interview-chat-theme">
            <Chat client={chatClient} theme="str-chat__theme-light">
              <Channel channel={channel}>
                <Window>
                  <MessageList />
                  <MessageComposer />
                </Window>
              </Channel>
            </Chat>
          </div>
        </div>

        {/* RIGHT PANEL — Editor + Output */}
        <div className="flex-1 flex flex-col bg-surface min-w-0">

          {/* Editor Header Bar */}
          <div className="bg-surface-raised border-b border-black/[0.06] px-4 py-2.5 flex justify-between items-center">
            <select 
              id="language-select" 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-surface-muted text-ink text-sm border border-black/[0.08] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-green/40 transition font-medium cursor-pointer"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python (3)</option>
              <option value="java">Java</option>
            </select>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-5 py-2 bg-accent-green text-white text-sm font-semibold rounded-xl hover:bg-accent-green/90 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? 'Running…' : 'Run Code'}
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative border-b border-black/[0.06]">
            <Editor
              height="100%"
              theme="vs-light"
              language={selectedLanguage}
              value={code}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: '"Plus Jakarta Sans", JetBrains Mono, monospace',
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                renderLineHighlight: 'gutter',
                lineNumbersMinChars: 3,
              }}
            />
          </div>

          {/* Terminal / AI Panel */}
          <div className="h-1/3 min-h-[200px] bg-surface-raised border-t border-black/[0.06] flex flex-col">

            {/* Tab Bar */}
            <div className="flex items-center gap-1 px-4 pt-3 pb-0">
              <button 
                onClick={() => setActiveTab('output')}
                className={`flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold px-3 py-2 rounded-lg transition ${
                  activeTab === 'output' 
                    ? 'bg-ink text-white' 
                    : 'text-ink-faint hover:text-ink-muted hover:bg-surface-muted'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Output
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold px-3 py-2 rounded-lg transition ${
                  activeTab === 'ai' 
                    ? 'bg-accent-purple text-white' 
                    : 'text-ink-faint hover:text-ink-muted hover:bg-surface-muted'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Assistant
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-4 py-3">
              {activeTab === 'output' ? (
                <pre className="text-ink-muted text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {output || 'Code output will appear here...'}
                </pre>
              ) : (
                <div className="flex flex-col h-full font-sans">
                  <div className="flex-1 overflow-y-auto space-y-3 pb-2 pr-1">
                    {aiMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center mb-3">
                          <Sparkles className="w-5 h-5 text-accent-purple" />
                        </div>
                        <p className="text-ink-faint text-sm">Ask the AI about your code — it has full context!</p>
                      </div>
                    ) : (
                      aiMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                            msg.role === 'user' 
                              ? 'bg-accent-green/10 border border-accent-green/20 text-ink' 
                              : 'bg-surface-muted border border-black/[0.06] text-ink-muted'
                          }`}>
                            <span className="text-[10px] uppercase font-bold opacity-40 block mb-1">
                              {msg.role === 'user' ? 'You' : 'AI'}
                            </span>
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          </div>
                        </div>
                      ))
                    )}
                    {isAiLoading && (
                       <div className="flex justify-start">
                         <div className="bg-surface-muted border border-black/[0.06] text-ink-muted rounded-2xl p-3 text-sm flex items-center gap-2">
                           <Loader2 className="w-4 h-4 animate-spin text-accent-purple" /> Thinking…
                         </div>
                       </div>
                    )}
                  </div>
                  <form onSubmit={handleSendAiMessage} className="mt-2 flex gap-2 pt-3 border-t border-black/[0.06]">
                    <input 
                      type="text" 
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Ask about your code…" 
                      className="flex-1 bg-surface-muted border border-black/[0.08] rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-purple/30 transition"
                    />
                    <button 
                      type="submit"
                      disabled={isAiLoading || !aiInput.trim()}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-accent-purple text-white text-sm font-semibold rounded-xl hover:bg-accent-purple/90 transition disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
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
  );
}
