import React from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { ArrowRight, Code2, Users, Video, ChevronDown, Sparkles, Zap, Shield } from "lucide-react";
import Logo from "../components/Logo";
import DigHole from "../components/DigHole";


import gradientOrange from "../assets/gradient_orange.png";
import gradientGreen from "../assets/gradient_green.png";
import gradientPurple from "../assets/gradient_purple.png";
import practiceCardBg from "../assets/practice_card_bg.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-surface text-ink selection:bg-accent-green/20">
      {/* ========== NAVBAR ========== */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 bg-surface/80 backdrop-blur-xl border-b border-black/[0.04]">
        {/* Logo */}
        <Logo />

        {/* Nav Links — desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-muted">
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-ink transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-ink transition-colors">Pricing</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <button className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors rounded-lg hover:bg-black/[0.03]">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-ink rounded-full hover:bg-ink/90 transition-all active:scale-95 shadow-sm">
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-12">
        {/* Top label */}
        <p className="text-sm font-semibold text-accent-green tracking-widest uppercase mb-6 animate-fade-in">
          Technical Interviews
        </p>

        {/* Hero grid: heading left, description right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.08] tracking-tight text-ink">
              Discover the{" "}
              <span className="accent-underline">freedom</span>
              <br className="hidden lg:block" />
              of interviewing
              <br className="hidden lg:block" />
              on your terms
            </h1>
          </div>

          <div className="flex flex-col items-start lg:items-end lg:text-right gap-6 lg:pt-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <p className="text-lg text-ink-muted leading-relaxed max-w-md">
              Real-time video, collaborative code editing, and integrated execution — all in one seamless platform.
            </p>
            <SignUpButton mode="modal">
              <button className="group flex items-center gap-3 px-7 py-4 text-base font-semibold text-white bg-ink rounded-full hover:bg-ink/90 transition-all active:scale-95 shadow-md hover:shadow-lg">
                Get Started Free
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* ========== DIG HOLE INTERACTIVE SECTION ========== */}
      <DigHole
        heading={["MEET", "FORGE"]}
        subtext="Drag your cursor across the surface to reveal what powers seamless interviews."
        accentColor="#5E8056"
      />

      {/* ========== BENTO GRID ========== */}
      <section id="features" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-4 auto-rows-[220px] lg:auto-rows-[280px]">

          {/* Card 1 — Practice Problems (large, spans 5 cols) */}
          <div className="col-span-4 lg:col-span-5 row-span-2 bento-card rounded-4xl overflow-hidden relative group cursor-pointer">
            <img
              src={practiceCardBg}
              alt="Practice problems background"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col justify-between p-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                Practice
                <br />
                Problems
              </h3>

              {/* Mini LeetCode-style problem cards */}
              <div className="space-y-2.5">
                {/* Problem 1 */}
                <div className="glass-card rounded-xl p-3 max-w-[280px] shadow-premium animate-float flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-white/60 shrink-0">01</span>
                    <span className="text-sm font-semibold text-white truncate">Two Sum</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/20 shrink-0">Easy</span>
                </div>

                {/* Problem 2 */}
                <div className="glass-card rounded-xl p-3 max-w-[260px] shadow-premium animate-float-delayed flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-white/60 shrink-0">02</span>
                    <span className="text-sm font-semibold text-white truncate">Valid Parentheses</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/20 shrink-0">Easy</span>
                </div>

                {/* Problem 3 */}
                <div className="glass-card rounded-xl p-3 max-w-[240px] shadow-premium flex items-center justify-between gap-3" style={{animationDelay: '0.8s'}}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-white/60 shrink-0">03</span>
                    <span className="text-sm font-semibold text-white truncate">Max Subarray</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/20 shrink-0">Med</span>
                </div>

                {/* Category pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">Array</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">Stack</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">DP</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">Hash Table</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-green/20 text-accent-green border border-accent-green/20">10+ More</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — Crystal Clear Video (spans 4 cols) */}
          <div className="col-span-4 lg:col-span-4 bento-card rounded-4xl overflow-hidden relative group cursor-pointer">
            <video
              src="https://videos.pexels.com/video-files/4154925/4154925-sd_640_360_30fps.mp4"
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col justify-between p-7 pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium">HD Video</span>
              </div>
              <h3 className="text-xl font-bold text-white">Crystal Clear Video</h3>
            </div>
          </div>

          {/* Card 3 — Secure Rooms (spans 3 cols) */}
          <div className="col-span-4 lg:col-span-3 bento-card rounded-4xl overflow-hidden relative group cursor-pointer bg-surface-muted">
            <div className="relative z-10 h-full flex flex-col justify-between p-7">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent-green" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink mb-1">1-on-1 Enforced</h3>
                <p className="text-sm text-ink-muted leading-relaxed">Secure rooms strictly limited to interviewer & candidate.</p>
              </div>
            </div>
            {/* Dot pattern decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 dot-pattern opacity-30" />
          </div>

          {/* Card 4 — Real-time Sync (spans 4 cols) */}
          <div className="col-span-4 lg:col-span-4 bento-card rounded-4xl overflow-hidden relative group cursor-pointer">
            <video
              src="https://videos.pexels.com/video-files/856974/856974-hd_1280_720_30fps.mp4"
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col justify-between p-7 pointer-events-none">
              <h3 className="text-xl font-bold text-white">Real-time Sync</h3>
              {/* Floating glass element */}
              <div className="glass-card rounded-xl p-3 max-w-[200px] shadow-premium animate-float-delayed">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-accent-orange" />
                  <span className="text-xs font-semibold text-ink">Latency</span>
                </div>
                <span className="text-2xl font-bold text-ink">&lt;50ms</span>
              </div>
            </div>
          </div>

          {/* Card 5 — Feature highlight with icons (spans 3 cols) */}
          <div className="col-span-4 lg:col-span-3 bento-card rounded-4xl bg-surface-raised border border-black/[0.06] p-7 flex flex-col justify-between cursor-pointer">
            <div>
              <div className="flex gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-purple" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent-green" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent-orange/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent-orange" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Built to Stand Apart</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Monaco editor, Stream video, Socket.io sync — enterprise-grade tools in a single workflow.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-accent-green font-semibold text-sm group/link cursor-pointer">
              Learn more
              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-accent-green tracking-widest uppercase mb-4">How it works</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink">
            Three steps. Zero friction.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Create a Room",
              desc: "Spin up a secure interview room instantly from your dashboard.",
              icon: <Sparkles className="w-6 h-6" />,
              color: "bg-accent-peach/40 text-accent-orange",
            },
            {
              step: "02",
              title: "Share the Link",
              desc: "Send the room ID to your candidate — they join in one click.",
              icon: <Users className="w-6 h-6" />,
              color: "bg-accent-green/10 text-accent-green",
            },
            {
              step: "03",
              title: "Interview Live",
              desc: "Collaborate on code, discuss problems, and evaluate — all in real time.",
              icon: <Video className="w-6 h-6" />,
              color: "bg-accent-purple/20 text-accent-purple",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bento-card rounded-4xl bg-surface-raised border border-black/[0.06] p-8 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <span className="text-4xl font-extrabold text-black/[0.06] group-hover:text-black/[0.12] transition-colors">
                  {item.step}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-ink-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative rounded-4xl overflow-hidden">
          <img
            src={gradientGreen}
            alt="Abstract gradient background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 py-20 px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Ready to forge better interviews?
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-lg mx-auto">
              Join hundreds of teams who trust MeetForge for their technical hiring.
            </p>
            <SignUpButton mode="modal">
              <button className="group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold bg-white text-ink rounded-full hover:bg-white/90 transition-all active:scale-95 shadow-lg hover:shadow-xl">
                Get Started — It's Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="max-w-7xl mx-auto px-6 pb-12">
        <div className="border-t border-black/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo className="scale-75 origin-left" />
          <p className="text-sm text-ink-faint">
            © {new Date().getFullYear()} MeetForge. Built for seamless technical interviews.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
