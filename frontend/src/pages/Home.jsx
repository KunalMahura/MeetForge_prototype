import React from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { ArrowRight, Code2, Users, Video } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-theme-red/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-theme-orange/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-theme-yellow/20 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="relative flex justify-between items-center p-6 lg:px-12 bg-black/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-theme-red/20 border border-theme-red/30">
              <Code2 className="w-6 h-6 text-theme-red" />
            </div>
            {/* Title for small screens */}
            <span className="md:hidden text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              MeetForge
            </span>
          </div>

          {/* Centered Title */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-2xl font-bold tracking-wider bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              MeetForge
            </span>
          </div>

          <div className="flex gap-4">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Get Started
              </button>
            </SignUpButton>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-theme-orange animate-pulse"></span>
            <span className="text-sm font-medium text-white/80">
              Next-Gen Tech Interviews
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
            The Ultimate Platform for <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-red via-theme-orange to-theme-yellow animate-gradient-x">
              Technical Interviews
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Conduct seamless technical interviews with real-time video, collaborative code editing, and integrated execution environments.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <SignUpButton mode="modal">
              <button className="group flex items-center justify-center gap-2 px-8 py-4 bg-theme-red hover:bg-[#A31616] text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(191,26,26,0.5)]">
                Start Interviewing Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all backdrop-blur-sm">
                Log into existing account
              </button>
            </SignInButton>
          </div>

          {/* Feature Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 text-left">
            {[
              {
                icon: <Code2 className="w-6 h-6 text-theme-red" />,
                title: "Live Code Editor",
                desc: "Collaborative Monaco editor with syntax highlighting and auto-completion.",
              },
              {
                icon: <Video className="w-6 h-6 text-theme-orange" />,
                title: "Crystal Clear Video",
                desc: "Integrated WebRTC video calls powered by Stream for seamless communication.",
              },
              {
                icon: <Users className="w-6 h-6 text-theme-yellow" />,
                title: "1-on-1 Enforced",
                desc: "Secure interview rooms strictly limited to one interviewer and one candidate.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
