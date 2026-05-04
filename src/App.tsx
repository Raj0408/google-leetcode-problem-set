import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Trophy, 
  BarChart3, 
  X,
  Code2,
  BookOpen,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { PROBLEM_DATA, type Problem } from './data/problems';

export default function App() {
  const [solvedIds, setSolvedIds] = useState<Set<string>>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('leetcode-488-solved') : null;
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [topicFilter, setTopicFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    localStorage.setItem('leetcode-488-solved', JSON.stringify(Array.from(solvedIds)));
  }, [solvedIds]);

  const toggleSolved = (id: string) => {
    setSolvedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    PROBLEM_DATA.forEach(p => {
      p.Topics.split(',').forEach(t => topics.add(t.trim()));
    });
    return Array.from(topics).sort();
  }, []);

  const stats = useMemo(() => {
    const total = PROBLEM_DATA.length;
    const solved = solvedIds.size;
    const byDifficulty: Record<string, { total: number, solved: number }> = {
      EASY: { total: 0, solved: 0 },
      MEDIUM: { total: 0, solved: 0 },
      HARD: { total: 0, solved: 0 },
    };

    PROBLEM_DATA.forEach(p => {
      if (p.Difficulty && byDifficulty[p.Difficulty]) {
        byDifficulty[p.Difficulty].total++;
        if (solvedIds.has(p.Number)) {
          byDifficulty[p.Difficulty].solved++;
        }
      }
    });

    return { total, solved, byDifficulty };
  }, [solvedIds]);

  const filteredProblems = useMemo(() => {
    return PROBLEM_DATA.filter(p => {
      const matchesSearch = p.Title.toLowerCase().includes(search.toLowerCase()) || 
                           p.Topics.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'ALL' || p.Difficulty === difficultyFilter;
      let matchesTopic = topicFilter === 'ALL' || p.Topics.split(',').some(t => t.trim() === topicFilter);
      // matchesTopic = solvedIds.forEach(element => {
      //   element === p.Number
      // });
      return matchesSearch && matchesDifficulty && matchesTopic;
    });
  }, [search, difficultyFilter, topicFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-indigo-200 shadow-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">LeetCode 488</h1>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mastery Tracker</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Total Progress:</span>
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.solved / stats.total) * 100}%` }}
                  className="h-full bg-indigo-600 rounded-full"
                />
              </div>
              <span className="text-sm font-bold text-indigo-600">{Math.round((stats.solved / stats.total) * 100)}%</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Overall" value={`${stats.solved}/${stats.total}`} sub="Progress" icon={<Trophy className="w-5 h-5 text-amber-500" />} color="bg-amber-50 text-amber-700" />
          <StatCard title="Easy" value={`${stats.byDifficulty.EASY.solved}/${stats.byDifficulty.EASY.total}`} sub="Basics" icon={<BarChart3 className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50 text-emerald-700" />
          <StatCard title="Medium" value={`${stats.byDifficulty.MEDIUM.solved}/${stats.byDifficulty.MEDIUM.total}`} sub="Patterns" icon={<BarChart3 className="w-5 h-5 text-blue-500" />} color="bg-blue-50 text-blue-700" />
          <StatCard title="Hard" value={`${stats.byDifficulty.HARD.solved}/${stats.byDifficulty.HARD.total}`} sub="Mastery" icon={<BarChart3 className="w-5 h-5 text-rose-500" />} color="bg-rose-50 text-rose-700" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select 
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Difficulty</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>

              <select 
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[150px]"
              >
                <option value="ALL">Topic</option>
                <option value="SOLVED">Solved</option>
                {allTopics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}><ListIcon className="w-4 h-4" /></button>
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}><LayoutGrid className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Topic Coverage Breakdown</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Array', 'String', 'Hash Table', 'DP', 'Graph', 'Tree', 'Greedy', 'Binary Search'].map(topic => {
                const count = PROBLEM_DATA.filter(p => p.Topics.includes(topic)).length;
                const percentage = Math.round((count / stats.total) * 100);
                return (
                  <div key={topic} className="flex flex-col gap-1 min-w-[80px]">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-600">{topic}</span>
                      <span className="text-[9px] text-slate-400">{count}</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400" style={{ width: `${Math.min(percentage * 2, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
          <AnimatePresence mode="popLayout">
            {filteredProblems.map((problem) => (
              <ProblemCard 
                key={problem.Number}
                problem={problem}
                isSolved={solvedIds.has(problem.Number)}
                onToggle={() => toggleSolved(problem.Number)}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProblems.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-lg font-semibold text-slate-900">No problems found</h3>
            <p className="text-slate-500">Try adjusting your filters.</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3 h-3" /> Expert Analysis
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Topic Coverage & Saturation Verdict</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Is it worth it?
                </h4>
                <p className="text-sm text-emerald-800">
                  <strong>Yes.</strong> This set goes beyond standard interview lists (like Blind 75) to cover "hard" constraints found in Google/Meta technical rounds. It bridges the gap between "standard DSA" and "Competitive Programming lite".
                </p>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-2">
                  <X className="w-4 h-4" /> Is it saturated?
                </h4>
                <p className="text-sm text-amber-800">
                  <strong>Moderately.</strong> At 488 problems, there is intentional repetition. However, in DSA, "saturation" is often "consolidation". You need to solve similar patterns multiple times to recognize them in under 2 minutes during an interview.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <p>
                <strong>The Verdict:</strong> If you have 3-6 months, follow this list strictly. If you have 1 month, prioritize the "Medium" and "Hard" problems tagged with "DP", "Graph", or "Sliding Window".
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2 text-xs">Missing Topics?</h4>
                <p className="text-[11px]">
                  This list is extremely dense. It covers <strong>Segment Trees</strong> and <strong>Rolling Hash</strong>, which are often missing from "saturated" beginner lists. The coverage is 95%+ complete for FAANG engineering levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ title, value, sub, icon, color }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</span>
      </div>
      <h3 className="text-xs font-medium text-slate-500">{title}</h3>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ProblemCard({ problem, isSolved, onToggle, viewMode }: any) {
  const diffMap: Record<string, string> = {
    EASY: "text-emerald-600 bg-emerald-50",
    MEDIUM: "text-blue-600 bg-blue-50",
    HARD: "text-rose-600 bg-rose-50"
  };

  if (viewMode === 'grid') {
    return (
      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`bg-white p-4 rounded-xl border-2 relative transition-all ${isSolved ? 'border-indigo-100 bg-indigo-50/10' : 'border-slate-100'}`}>
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${diffMap[problem.Difficulty] || 'bg-slate-100'}`}>{problem.Difficulty}</span>
          <button onClick={onToggle} className={isSolved ? 'text-indigo-600' : 'text-slate-300'}><CheckCircle2 className="w-5 h-5" /></button>
        </div>
        <h3 className={`text-sm font-bold leading-tight mb-2 ${isSolved ? 'line-through text-slate-400' : ''}`}>{problem.Title}</h3>
        <div className="flex flex-wrap gap-1">
          {problem.Topics.split(',').slice(0, 2).map((t: string) => <span key={t} className="text-[9px] bg-slate-50 border border-slate-100 px-1 rounded text-slate-500">{t.trim()}</span>)}
        </div>
        <a href={problem.Link} target="_blank" rel="noreferrer" className="absolute top-2 right-10 text-slate-300 hover:text-indigo-600 p-1"><ExternalLink className="w-3.5 h-3.5" /></a>
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center gap-3 p-2 rounded-lg ${isSolved ? 'bg-indigo-50/30' : 'bg-white hover:bg-slate-50'} border border-transparent hover:border-slate-100 transition-all group`}>
      <button onClick={onToggle} className={isSolved ? 'text-indigo-600' : 'text-slate-300'}>{isSolved ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}</button>
      <div className="flex-1 min-w-0">
        <a href={problem.Link} target="_blank" rel="noreferrer" className={`text-sm font-semibold truncate block ${isSolved ? 'line-through text-slate-400' : 'text-slate-900 shadow-indigo-600'}`}>{problem.Title}</a>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[9px] font-bold uppercase ${diffMap[problem.Difficulty] || 'text-slate-400'}`}>{problem.Difficulty}</span>
          <span className="text-[10px] text-slate-400 truncate">{problem.Topics}</span>
        </div>
      </div>
      <a href={problem.Link} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-300 hover:text-indigo-600"><ExternalLink className="w-4 h-4" /></a>
    </motion.div>
  );
}
