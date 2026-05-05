import React, { useState, useEffect } from 'react';
import { UserButton, useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Video, Loader2, Plus, ArrowRight, Clock, CheckCircle2, Code2 } from 'lucide-react';
import Logo from '../components/Logo';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!userId) return;
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const res = await fetch(`${backendUrl}/api/interviews?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          setInterviews(data.interviews);
        }
      } catch (err) {
        console.error("Failed to fetch interviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [userId]);

  const handleCreateRoom = async () => {
    if (!userId) return;
    setIsCreating(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await fetch(`${backendUrl}/api/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId,
          email: user?.primaryEmailAddress?.emailAddress || 'unknown@example.com',
          username: user?.username || user?.firstName || 'User',
          imageUrl: user?.imageUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        navigate(`/interview/${data.roomId}`);
      }
    } catch (err) {
      console.error("Failed to create room", err);
      alert("Failed to create session. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinRoomId.trim()) return;
    setIsJoining(true);
    navigate(`/interview/${joinRoomId.trim()}`);
  };

  const upcomingInterviews = interviews.filter(i => i.status === 'scheduled');
  const pastInterviews = interviews.filter(i => i.status !== 'scheduled');

  return (
    <div className="min-h-screen bg-surface text-ink">

      {/* ========== HEADER ========== */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 bg-surface/80 backdrop-blur-xl border-b border-black/[0.04]">
        <Logo />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-10 h-10 border-2 border-black/10 rounded-full",
            },
          }}
        />
      </header>

      {/* ========== MAIN ========== */}
      <main className="max-w-6xl mx-auto px-6 py-10 lg:py-14">

        {/* Welcome banner */}
        <section className="relative rounded-4xl bg-surface-raised border border-black/[0.06] shadow-premium-lg p-8 md:p-12 mb-10 overflow-hidden">
          {/* Decorative dots */}
          <div className="absolute -top-8 -right-8 w-40 h-40 dot-pattern opacity-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <p className="text-sm font-semibold text-accent-green tracking-widest uppercase mb-2">Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-2">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ''} 👋
              </h1>
              <p className="text-ink-muted text-lg">
                Start a new interview session or join an existing room.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white bg-ink rounded-full hover:bg-ink/90 transition-all active:scale-95 shadow-md hover:shadow-lg disabled:opacity-60 disabled:hover:scale-100"
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isCreating ? 'Creating…' : 'New Interview'}
              </button>
              <button
                onClick={() => navigate('/practice')}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-accent-green bg-accent-green/10 border border-accent-green/20 rounded-full hover:bg-accent-green/20 transition-all active:scale-95"
              >
                <Code2 className="w-4 h-4" />
                Practice Problems
              </button>
            </div>
          </div>

          {/* Join form */}
          <div className="relative z-10 mt-8 pt-8 border-t border-black/[0.06] max-w-md">
            <form onSubmit={handleJoinRoom} className="flex gap-2">
              <input
                type="text"
                placeholder="Paste Room ID to join…"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                className="flex-1 bg-surface-muted border border-black/[0.08] rounded-xl px-4 py-3 text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/40 transition-all"
              />
              <button
                type="submit"
                disabled={!joinRoomId.trim() || isJoining}
                className="flex items-center gap-2 px-5 py-3 bg-accent-green/10 text-accent-green font-semibold text-sm rounded-xl hover:bg-accent-green/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Join
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>

        {/* Interview lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Upcoming Sessions */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-accent-orange animate-pulse" />
              <h2 className="text-lg font-bold text-ink">Upcoming Sessions</h2>
            </div>
            <div className="rounded-3xl bg-surface-raised border border-black/[0.06] shadow-premium p-6 min-h-[220px] flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-ink-faint" />
                </div>
              ) : upcomingInterviews.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingInterviews.map(interview => (
                    <li
                      key={interview._id}
                      onClick={() => navigate(`/interview/${interview.roomId}`)}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-surface-muted hover:bg-accent-green/5 border border-transparent hover:border-accent-green/20 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-orange/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-accent-orange" />
                        </div>
                        <div>
                          <span className="font-semibold text-ink block text-sm">Room: {interview.roomId.slice(0, 8)}…</span>
                          <span className="text-ink-faint text-xs">
                            {new Date(interview.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <span className="text-accent-green text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Join <ArrowRight className="w-3 h-3" />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                  <div className="w-12 h-12 rounded-2xl bg-surface-muted flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-ink-faint" />
                  </div>
                  <p className="text-ink-faint text-sm">No upcoming sessions right now.</p>
                </div>
              )}
            </div>
          </section>

          {/* Past Interviews */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-accent-purple" />
              <h2 className="text-lg font-bold text-ink">Past Interviews</h2>
            </div>
            <div className="rounded-3xl bg-surface-raised border border-black/[0.06] shadow-premium p-6 min-h-[220px] flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-ink-faint" />
                </div>
              ) : pastInterviews.length > 0 ? (
                <ul className="space-y-3">
                  {pastInterviews.map(interview => (
                    <li
                      key={interview._id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-surface-muted border border-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-accent-purple" />
                        </div>
                        <div>
                          <span className="font-semibold text-ink block text-sm">Room: {interview.roomId.slice(0, 8)}…</span>
                          <span className="text-ink-faint text-xs capitalize">{interview.status}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                  <div className="w-12 h-12 rounded-2xl bg-surface-muted flex items-center justify-center mb-3">
                    <Video className="w-5 h-5 text-ink-faint" />
                  </div>
                  <p className="text-ink-faint text-sm">No completed interviews yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
