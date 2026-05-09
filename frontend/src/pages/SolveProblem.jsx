import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Editor } from '@monaco-editor/react';
import { Play, Loader2, ChevronLeft, Save, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';

const difficultyConfig = {
  Easy: { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Medium: { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  Hard: { color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
};

export default function SolveProblem() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const res = await fetch(`${backendUrl}/api/problems/${slug}`);
        const data = await res.json();
        
        if (data.success) {
          const fetchedProblem = data.problem;
          setProblem(fetchedProblem);
          
          let initialCode = fetchedProblem.boilerplate?.javascript || '// Write your solution here';
          let initialLang = 'javascript';
          
          // Fetch latest submission if user is logged in
          if (userId) {
            const subRes = await fetch(`${backendUrl}/api/submissions/latest?userId=${userId}&problemId=${fetchedProblem._id}`);
            const subData = await subRes.json();
            if (subData.success && subData.submission) {
              initialCode = subData.submission.code;
              initialLang = subData.submission.language;
              setOutput(subData.submission.output || '');
            }
          }
          
          setCode(initialCode);
          setLanguage(initialLang);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, userId]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem?.boilerplate?.[newLang]) {
      setCode(problem.boilerplate[newLang]);
    }
  };

  const handleSave = async (statusOverride = 'Attempted', outputOverride = output) => {
    if (!userId || !problem) return;
    setIsSaving(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      await fetch(`${backendUrl}/api/submissions/upsert`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          problemId: problem._id,
          code,
          language,
          status: statusOverride,
          output: outputOverride,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await fetch(`${backendUrl}/api/code/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_code: code, language }),
      });
      const data = await res.json();
      const result = data.run?.output || data.compile?.output || data.error || 'No output.';
      setOutput(result);
      
      // Auto-save submission on run
      await handleSave('Attempted', result);
      
    } catch (err) {
      setOutput('Failed to connect to code runner.');
    } finally {
      setIsRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-accent-green" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-surface text-ink">
        <p className="text-xl font-bold mb-4">Problem not found</p>
        <button onClick={() => navigate('/practice')} className="px-6 py-2.5 bg-ink text-white rounded-full text-sm font-semibold">
          Back to Problems
        </button>
      </div>
    );
  }

  const dc = difficultyConfig[problem.difficulty] || difficultyConfig.Easy;

  return (
    <div className="h-screen flex flex-col bg-surface text-ink overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 bg-surface-raised border-b border-black/[0.06] shadow-sm z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/practice')} className="p-2 hover:bg-surface-muted rounded-xl transition text-ink-muted hover:text-ink">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <Logo />
          <div className="ml-3 border-l border-black/[0.06] pl-3">
            <h1 className="text-sm font-bold text-ink leading-tight">{problem.title}</h1>
            <span className={`text-[11px] font-bold ${dc.color}`}>{problem.difficulty}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs font-semibold text-accent-green mr-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>}
          
          <button onClick={() => handleSave('Solved')} disabled={isSaving || isRunning}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-black/[0.08] bg-surface hover:bg-emerald-50 text-emerald-600 hover:border-emerald-200 transition disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark Solved
          </button>
          
          <button onClick={handleRunCode} disabled={isRunning}
            className="flex items-center gap-1.5 px-5 py-2 bg-accent-green text-white text-sm font-semibold rounded-xl hover:bg-accent-green/90 transition active:scale-95 disabled:opacity-50 shadow-sm"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Running…' : 'Run Code'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT — Problem Description */}
        <div className="w-[420px] lg:w-[480px] min-w-[320px] border-r border-black/[0.06] flex flex-col bg-surface-raised overflow-y-auto">
          <div className="p-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${dc.bg} ${dc.color} ${dc.border}`}>
                {problem.difficulty}
              </span>
              {problem.tags?.map(tag => (
                <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-surface-muted text-ink-muted border border-black/[0.04]">{tag}</span>
              ))}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-extrabold text-ink mb-4">{problem.title}</h2>

            {/* Description */}
            <div className="prose prose-sm max-w-none text-ink-muted leading-relaxed mb-6 whitespace-pre-wrap">
              {problem.description}
            </div>

            {/* Examples */}
            {problem.examples?.length > 0 && (
              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Examples</h3>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="bg-surface-muted rounded-xl p-4 border border-black/[0.04]">
                    <p className="text-xs font-bold text-ink-faint mb-1">Example {i + 1}</p>
                    <p className="text-sm font-mono text-ink"><strong>Input:</strong> {ex.input}</p>
                    <p className="text-sm font-mono text-ink"><strong>Output:</strong> {ex.output}</p>
                    {ex.explanation && <p className="text-sm text-ink-muted mt-1"><strong>Explanation:</strong> {ex.explanation}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {problem.constraints?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-2">Constraints</h3>
                <ul className="list-disc list-inside space-y-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="text-sm text-ink-muted font-mono">{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Editor + Output */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Language Selector */}
          <div className="bg-surface-raised border-b border-black/[0.06] px-4 py-2.5 flex items-center">
            <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-surface-muted text-ink text-sm border border-black/[0.08] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-green/40 font-medium cursor-pointer"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python (3)</option>
              <option value="java">Java</option>
            </select>
          </div>

          {/* Editor */}
          <div className="flex-1 border-b border-black/[0.06]">
            <Editor height="100%" theme="vs-light" language={language === 'python' ? 'python' : language} value={code} onChange={(v) => setCode(v || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 }, scrollBeyondLastLine: false, renderLineHighlight: 'gutter', lineNumbersMinChars: 3 }}
            />
          </div>

          {/* Output */}
          <div className="h-1/4 min-h-[140px] bg-surface-raised p-4 overflow-y-auto">
            <p className="text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Output</p>
            <pre className="text-sm text-ink-muted whitespace-pre-wrap font-mono leading-relaxed">
              {output || 'Run your code to see output here...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
