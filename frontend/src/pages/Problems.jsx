import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { Search, Filter, ChevronRight, Code2, Loader2, BookOpen, Trophy, Flame } from 'lucide-react';
import Logo from '../components/Logo';

const difficultyConfig = {
  Easy: { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', ring: 'ring-emerald-400/20' },
  Medium: { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', ring: 'ring-amber-400/20' },
  Hard: { color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', ring: 'ring-red-400/20' },
};

export default function Problems() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [stats, setStats] = useState({ solved: 0, attempted: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const [problemsRes, statsRes] = await Promise.all([
          fetch(`${backendUrl}/api/problems`),
          userId ? fetch(`${backendUrl}/api/submissions/stats?userId=${userId}`) : Promise.resolve(null),
        ]);
        const problemsData = await problemsRes.json();
        if (problemsData.success) setProblems(problemsData.problems);

        if (statsRes) {
          const statsData = await statsRes.json();
          if (statsData.success) setStats(statsData.stats);
        }
      } catch (err) {
        console.error('Failed to fetch problems:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const filtered = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDifficulty = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;

  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 bg-surface/80 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-ink-muted">
            <button onClick={() => navigate('/')} className="px-3 py-1.5 rounded-lg hover:bg-surface-muted transition">Dashboard</button>
            <span className="text-ink-faint">/</span>
            <span className="px-3 py-1.5 text-ink font-semibold">Practice</span>
          </div>
        </div>
        <UserButton afterSignOutUrl="/"
          appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border-2 border-black/10 rounded-full" } }}
        />
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-surface-raised border border-black/[0.06] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-ink">{problems.length}</p>
              <p className="text-sm text-ink-muted">Total Problems</p>
            </div>
          </div>
          <div className="bg-surface-raised border border-black/[0.06] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-ink">{stats.solved}</p>
              <p className="text-sm text-ink-muted">Solved</p>
            </div>
          </div>
          <div className="bg-surface-raised border border-black/[0.06] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-ink">{stats.attempted}</p>
              <p className="text-sm text-ink-muted">Attempted</p>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Search by title or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-muted border border-black/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-green/40 transition"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDifficulty(d)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                  filterDifficulty === d
                    ? 'bg-ink text-white border-ink shadow-sm'
                    : 'bg-surface-raised text-ink-muted border-black/[0.08] hover:border-black/[0.15]'
                }`}
              >
                {d} {d === 'Easy' ? `(${easyCount})` : d === 'Medium' ? `(${mediumCount})` : d === 'Hard' ? `(${hardCount})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Problem List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent-green" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink-faint text-lg">No problems found. Run the seed script first!</p>
            <code className="text-sm mt-2 block text-ink-muted bg-surface-muted px-4 py-2 rounded-lg inline-block mt-3">
              node scripts/seedProblems.js
            </code>
          </div>
        ) : (
          <div className="bg-surface-raised border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-[auto_1fr_120px_200px_50px] items-center px-6 py-3 border-b border-black/[0.06] text-xs font-bold text-ink-faint uppercase tracking-wider">
              <span className="w-10">#</span>
              <span>Title</span>
              <span className="text-center">Difficulty</span>
              <span className="text-center">Tags</span>
              <span></span>
            </div>

            {/* Rows */}
            {filtered.map((problem, i) => {
              const dc = difficultyConfig[problem.difficulty];
              return (
                <button
                  key={problem.slug}
                  onClick={() => navigate(`/practice/${problem.slug}`)}
                  className="w-full grid grid-cols-[auto_1fr_120px_200px_50px] items-center px-6 py-4 border-b border-black/[0.04] hover:bg-surface-muted/60 transition-colors group text-left"
                >
                  <span className="w-10 text-sm font-bold text-ink-faint">{problem.order || i + 1}</span>
                  <span className="text-sm font-semibold text-ink group-hover:text-accent-green transition-colors">{problem.title}</span>
                  <span className="text-center">
                    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${dc.bg} ${dc.color} ${dc.border} border`}>
                      {problem.difficulty}
                    </span>
                  </span>
                  <span className="text-center flex flex-wrap justify-center gap-1">
                    {problem.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-muted text-ink-muted">{tag}</span>
                    ))}
                  </span>
                  <span className="flex justify-end">
                    <ChevronRight className="w-4 h-4 text-ink-faint group-hover:text-accent-green transition-colors" />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
