import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    // Basic logic to generate a unique room ID
    const roomId = Math.random().toString(36).substring(2, 12);
    navigate(`/interview/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-theme-red/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-theme-orange/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-theme-yellow/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex justify-between items-center p-6 lg:px-12 bg-black/50 backdrop-blur-md border-b border-white/5 sticky top-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            MeetForge
          </h1>
          <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border border-white/10" } }} />
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-8 lg:p-12">
          <section className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto backdrop-blur-sm shadow-2xl mb-16 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Welcome to your Dashboard</h2>
            <p className="text-lg text-white/60 mb-10">
              Create a new 1-on-1 interview session or view your past interviews below.
            </p>
            
            <button
              onClick={handleCreateRoom}
              className="group inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-theme-red hover:bg-[#A31616] transition-all shadow-[0_0_40px_rgba(191,26,26,0.3)] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-navy focus:ring-theme-red"
            >
              <Video className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Start New Interview
            </button>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <section className="flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-orange animate-pulse-slow"></span>
                Upcoming Sessions
              </h3>
              <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 hover:bg-white/[0.04] transition-colors flex items-center justify-center">
                <p className="text-white/40 italic text-center">No upcoming sessions right now.</p>
              </div>
            </section>

            <section className="flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-yellow"></span>
                Past Interviews
              </h3>
              <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 hover:bg-white/[0.04] transition-colors flex items-center justify-center">
                <p className="text-white/40 italic text-center">You have not completed any interviews yet.</p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
