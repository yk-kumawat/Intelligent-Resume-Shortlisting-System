import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [topK, setTopK] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!jobDescription.trim()) {
      setError("Please provide a job description first.");
      return;
    }
    setError(null);
    setIsSearching(true);

    try {
      const response = await fetch("http://localhost:3000/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: jobDescription, top_k: topK })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch ranking from API");
      }

      // Map backend fields to UI fields
      // Backend returns: [{ ID, Category, Base_Score, Exp, Edu, Final_Score }, ...]
      const items = Array.isArray(data) ? data : (data.results || []);

      const mappedResults = items.map((item: any) => ({
        id: item.ID || Math.random(),
        name: `Candidate #${item.ID || 'Unknown'}`,
        score: Math.round(item.Final_Score || 0),
        skills: [
          item.Category ? item.Category.replace(/-/g, ' ') : "",
          `Exp: ${item.Exp || 0} yrs`,
          `Edu: Level ${item.Edu || 0}`
        ].filter(Boolean),
        role: item.Category ? item.Category.replace(/-/g, ' ') : "Candidate Profile",
        resumeHtml: item.Resume_html || ""
      }));

      setResults(mappedResults);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const openHtmlResume = (htmlContent: string) => {
    if (!htmlContent) {
      alert("No HTML content available for this candidate.");
      return;
    }
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body p-6 md:p-10">

      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-semibold tracking-tight text-on-surface">Curator <span className="text-primary">Dashboard</span></h1>
          <p className="text-on-surface-variant text-sm mt-1">Intelligent Resume Shortlisting System</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/15">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">notifications</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary font-bold">
            HR
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Search Controls */}
        <section className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/15 relative overflow-hidden">
            {/* Subtle Glassmorphism Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-xl font-headline font-medium mb-6">Search Criteria</h2>

            {/* Job Description */}
            <div className="mb-5">
              <label className="block text-sm font-label text-on-surface-variant uppercase tracking-wider mb-2">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface border border-outline-variant/10 rounded-xl p-4 min-h-[160px] focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all resize-none shadow-inner"
                placeholder="Paste the job requirements, skills, and experience here..."
              ></textarea>
              {error && <p className="text-error mt-2 font-medium text-sm">{error}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Top K */}
              <div>
                <label className="block text-sm font-label text-on-surface-variant uppercase tracking-wider mb-2">Top K Candidates</label>
                <div className="relative">
                  <input
                    type="number"
                    value={topK}
                    onChange={(e) => setTopK(Number(e.target.value))}
                    min={1}
                    max={50}
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant/10 rounded-xl p-4 focus:outline-none shadow-inner"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-sm">group</span>
                </div>
              </div>

              {/* Dataset */}
              <div>
                <label className="block text-sm font-label text-on-surface-variant uppercase tracking-wider mb-2">Dataset</label>
                <div className="relative">
                  <select className="w-full bg-surface-container-low text-on-surface border border-outline-variant/10 rounded-xl p-4 appearance-none focus:outline-none shadow-inner cursor-pointer">
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-sm pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className={`w-full relative group overflow-hidden rounded-full h-14 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3),_0_0_15px_rgba(187,195,255,0.05)] transition-all ${isSearching ? 'bg-surface-container-high' : 'bg-gradient-to-br from-primary to-primary-container hover:brightness-110 active:scale-[0.98]'}`}
            >
              <span className={`relative z-10 flex items-center gap-2 font-bold ${isSearching ? 'text-on-surface-variant' : 'text-on-primary'}`}>
                {isSearching ? 'Analyzing via Neural Engine...' : 'Run Neural Ranking'}
                {!isSearching && <span className="material-symbols-outlined text-[18px]">temp_preferences_custom</span>}
              </span>
            </button>
          </div>
        </section>


        {/* Right Column: AI-Powered Results Table */}
        <section className="col-span-1 lg:col-span-8">
          <div className="bg-surface rounded-2xl min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-xl font-headline font-medium">Shortlisted Candidates</h2>
              {results.length > 0 && (
                <span className="text-sm text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/15">
                  Showing {results.length} results
                </span>
              )}
            </div>

            {results.length === 0 ? (
              // Empty State
              <div className="flex-1 border border-outline-variant/10 border-dashed rounded-2xl flex flex-col items-center justify-center p-10 text-center bg-surface-container-low/30 relative overflow-hidden">
                {isSearching ? (
                  // "Pulse" Loader (AI is thinking)
                  <div className="relative flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px] animate-pulse"></div>
                    <span className="material-symbols-outlined text-4xl text-primary animate-bounce mb-4">memory</span>
                    <p className="text-on-surface font-medium z-10 text-lg">Cross-referencing embeddings...</p>
                    <p className="text-on-surface-variant text-sm z-10 mt-2">Applying bias-reduced NLP models</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 border border-outline-variant/15 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                      <span className="material-symbols-outlined text-on-surface-variant text-2xl">person_search</span>
                    </div>
                    <h3 className="text-on-surface font-medium text-lg">No Results Yet</h3>
                    <p className="text-on-surface-variant mt-2 max-w-sm">Enter a job description and click "Run Neural Ranking" to find the best candidate matches.</p>
                  </>
                )}
              </div>
            ) : (
              // Results List
              <div
                className="flex flex-col gap-3 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden"
                style={{ maxHeight: '600px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Header Row (Optional, conceptual) */}
                <div className="shrink-0 grid grid-cols-12 gap-4 px-6 py-2 text-xs font-label uppercase tracking-wider text-on-surface-variant sticky top-0 bg-surface z-10">
                  <div className="col-span-4">Candidate</div>
                  <div className="col-span-2 text-center">Match</div>
                  <div className="col-span-4">Matched Skills</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                {results.map((candidate) => (
                  <div key={candidate.id} className="shrink-0 group grid grid-cols-12 gap-4 items-center bg-surface-container-low hover:bg-surface-container p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-outline-variant/15 cursor-default relative overflow-hidden">
                    {/* Hover subtle glow */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Candidate Info */}
                    <div className="col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface font-medium border border-outline-variant/20 shadow-inner">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-on-surface font-medium">{candidate.name}</p>
                        <p className="text-on-surface-variant text-xs">{candidate.role}</p>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="col-span-2 flex flex-col items-center justify-center gap-1">
                      <div className="relative flex items-center justify-center w-12 h-12">
                        {/* Circle Progress (Simulated with SVG for sleekness) */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-surface-container-highest" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-primary" strokeDasharray={`${candidate.score}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute text-xs font-bold text-on-surface">{candidate.score}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="col-span-4 flex flex-wrap gap-2">
                      {candidate.skills.map((skill: string) => (
                        <span key={skill} className="bg-secondary-container text-on-secondary-container text-[11px] px-3 py-1 rounded-full font-medium border border-outline-variant/5">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Action */}
                    <div className="col-span-2 flex justify-end">
                      <button
                        onClick={() => openHtmlResume(candidate.resumeHtml)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant/15 text-on-surface text-sm font-medium hover:bg-surface-container-highest hover:text-primary transition-colors cursor-pointer active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        <span className="hidden xl:inline">View</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
