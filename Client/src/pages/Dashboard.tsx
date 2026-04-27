import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Dashboard: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [topK, setTopK] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description first.');
      return;
    }
    setError(null);
    setIsSearching(true);
    try {
      const response = await fetch('http://localhost:3000/rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription, top_k: topK }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch ranking from API');

      const items = Array.isArray(data) ? data : (data.results || []);
      setResults(items.map((item: any) => ({
        id: item.ID || Math.random(),
        name: `Candidate #${item.ID || 'Unknown'}`,
        score: Math.round(item.Final_Score || 0),
        skills: [
          item.Category ? item.Category.replace(/-/g, ' ') : '',
          `Exp: ${item.Exp || 0} yrs`,
          `Edu: Level ${item.Edu || 0}`,
        ].filter(Boolean),
        role: item.Category ? item.Category.replace(/-/g, ' ') : 'Candidate Profile',
        resumeHtml: item.Resume_html || '',
      })));
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const openHtmlResume = (html: string) => {
    if (!html) { alert('No HTML content available for this candidate.'); return; }
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  };

  return (
    <div className="h-screen bg-background text-on-surface font-body overflow-hidden flex">

      {/* ── Sidebar ─────────────────────────────── */}
      <Sidebar />

      {/* ── Main area ───────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden p-6 md:p-8">

        {/* Header */}
        <header className="mb-6 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-headline font-semibold tracking-tight">
              Curator <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-on-surface-variant text-xs mt-0.5">
              Intelligent Resume Shortlisting System
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/15">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">notifications</span>
          </div>
        </header>

        {/* ── Content grid ─────────────────────── */}
        <div className="flex-1 flex gap-6 min-h-0">

          {/* Left: Search Controls */}
          <section className="w-96 shrink-0 flex flex-col">
            <div className="flex-1 bg-surface-container rounded-2xl p-5 border border-outline-variant/15 relative overflow-hidden flex flex-col min-h-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-base font-headline font-medium mb-4 shrink-0">Search Criteria</h2>

              {/* Job Description */}
              <div className="flex flex-col mb-4">
                <label className="block text-xs font-label text-on-surface-variant uppercase tracking-wider mb-2 shrink-0">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  className="h-56 w-full bg-surface-container-low text-on-surface border border-outline-variant/10 rounded-xl p-3 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all resize-none text-sm"
                  placeholder="Paste job requirements, skills, and experience here..."
                />
                {error && <p className="text-error mt-1.5 text-xs font-medium">{error}</p>}
              </div>

              {/* Top K + Dataset */}
              <div className="grid grid-cols-2 gap-3 mb-5 shrink-0">
                <div>
                  <label className="block text-xs font-label text-on-surface-variant uppercase tracking-wider mb-1.5">Top K</label>
                  <input
                    type="number"
                    value={topK}
                    onChange={e => setTopK(Number(e.target.value))}
                    min={1} max={50}
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label text-on-surface-variant uppercase tracking-wider mb-1.5">Dataset</label>
                  <div className="relative">
                    <select className="w-full bg-surface-container-low text-on-surface border border-outline-variant/10 rounded-xl px-3 py-2.5 text-sm appearance-none focus:outline-none cursor-pointer">
                      <option>Engineering</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[16px] pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className={`shrink-0 w-full rounded-full h-12 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all
                  ${isSearching
                    ? 'bg-surface-container-high text-on-surface-variant'
                    : 'bg-gradient-to-br from-primary to-primary-container text-on-primary hover:brightness-110 active:scale-[0.98]'
                  }`}
              >
                <span className="flex items-center gap-2 font-bold text-sm">
                  {isSearching ? 'Analyzing...' : 'Run Neural Ranking'}
                  {!isSearching && (
                    <span className="material-symbols-outlined text-[16px]">temp_preferences_custom</span>
                  )}
                </span>
              </button>
            </div>
          </section>

          {/* Right: Results */}
          <section className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 bg-surface rounded-2xl flex flex-col overflow-hidden p-5 min-h-0">

              <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-base font-headline font-medium">Shortlisted Candidates</h2>
                {results.length > 0 && (
                  <span className="text-xs text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/15">
                    Showing {results.length} results
                  </span>
                )}
              </div>

              {results.length === 0 ? (
                /* Empty / Loading state */
                <div className="flex-1 border border-outline-variant/10 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/30 relative overflow-hidden">
                  {isSearching ? (
                    <div className="relative flex flex-col items-center justify-center">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px] animate-pulse" />
                      <span className="material-symbols-outlined text-4xl text-primary animate-bounce mb-4">memory</span>
                      <p className="text-on-surface font-medium z-10">Cross-referencing embeddings...</p>
                      <p className="text-on-surface-variant text-sm z-10 mt-1">Applying bias-reduced NLP models</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center mb-4 border border-outline-variant/15">
                        <span className="material-symbols-outlined text-on-surface-variant text-2xl">person_search</span>
                      </div>
                      <h3 className="text-on-surface font-medium">No Results Yet</h3>
                      <p className="text-on-surface-variant mt-1.5 max-w-sm text-sm">
                        Enter a job description and click "Run Neural Ranking" to find the best matches.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                /* Results list */
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {/* Table header */}
                  <div className="shrink-0 grid grid-cols-12 gap-4 px-4 py-2 text-xs font-label uppercase tracking-wider text-on-surface-variant">
                    <div className="col-span-4">Candidate</div>
                    <div className="col-span-2 text-center">Match</div>
                    <div className="col-span-4">Matched Skills</div>
                    <div className="col-span-2 text-right">Action</div>
                  </div>

                  {/* Scrollable rows */}
                  <div
                    className="flex-1 overflow-y-auto flex flex-col gap-2 [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {results.map(candidate => (
                      <div
                        key={candidate.id}
                        className="shrink-0 group grid grid-cols-12 gap-4 items-center bg-surface-container-low hover:bg-surface-container px-4 py-3 rounded-2xl transition-all duration-200 border border-transparent hover:border-outline-variant/15 relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />

                        {/* Candidate info */}
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface font-medium border border-outline-variant/20 text-sm shrink-0">
                            {candidate.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-on-surface font-medium text-sm truncate">{candidate.name}</p>
                            <p className="text-on-surface-variant text-xs truncate">{candidate.role}</p>
                          </div>
                        </div>

                        {/* Score ring */}
                        <div className="col-span-2 flex items-center justify-center">
                          <div className="relative w-11 h-11">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <path className="text-surface-container-highest" strokeWidth="3" stroke="currentColor" fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              <path className="text-primary" strokeDasharray={`${candidate.score}, 100`} strokeWidth="3"
                                strokeLinecap="round" stroke="currentColor" fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-on-surface">
                              {candidate.score}
                            </span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="col-span-4 flex flex-wrap gap-1.5">
                          {candidate.skills.map((skill: string) => (
                            <span key={skill} className="bg-secondary-container text-on-secondary-container text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Action */}
                        <div className="col-span-2 flex justify-end">
                          <button
                            onClick={() => openHtmlResume(candidate.resumeHtml)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/15 text-on-surface text-xs font-medium hover:bg-surface-container-highest hover:text-primary transition-colors active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span className="hidden xl:inline">View</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
