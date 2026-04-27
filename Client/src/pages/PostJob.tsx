import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

/* ─── Types ─────────────────────────────────────────────── */
interface JobForm {
  title: string;
  category: string;
  location: string;
  employmentType: string;
  experienceYears: string;
  educationLevel: string;
  skills: string[];
  description: string;
  deadline: string;
  openings: string;
}

const INITIAL: JobForm = {
  title: '',
  category: '',
  location: '',
  employmentType: 'Full-time',
  experienceYears: '',
  educationLevel: 'any',
  skills: [],
  description: '',
  deadline: '',
  openings: '1',
};

const CATEGORIES = [
  'Information Technology',
  'Finance & Accounting',
  'Healthcare',
  'Marketing & Sales',
  'Education',
  'Human Resources',
  'Engineering',
  'Design & Creative',
  'Legal',
  'Operations',
];

const EDU_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'phd', label: 'PhD / Doctorate' },
];

const MAX_DESC = 2000;

/* ─── Component ─────────────────────────────────────────── */
const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<JobForm>(INITIAL);
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* helpers */
  const set = (field: keyof JobForm, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const addSkill = () => {
    const tag = skillInput.trim();
    if (tag && !form.skills.includes(tag)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, tag] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) =>
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  const handleSkillKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (asDraft = false) => {
    setIsSubmitting(true);
    // TODO: wire up to backend POST /jobs endpoint
    await new Promise(r => setTimeout(r, 800)); // simulated
    console.log(asDraft ? 'Draft saved:' : 'Job published:', form);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  /* ── Input class helpers ──────────────────────────────── */
  const inputCls =
    'w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-xl ' +
    'border border-outline-variant/10 focus:outline-none focus:border-primary/40 ' +
    'focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50 text-sm';

  const labelCls =
    'block text-xs font-label text-on-surface-variant uppercase tracking-wider mb-1.5';

  /* ── Success state ────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-body p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-headline font-semibold text-on-surface mb-2">Job Posted!</h2>
          <p className="text-on-surface-variant text-sm mb-6">
            The vacancy has been published. The AI will start matching resumes once applications arrive.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setForm(INITIAL); }}
              className="px-5 py-2.5 rounded-xl border border-outline-variant/20 text-on-surface text-sm hover:bg-surface-container transition-colors"
            >
              Post Another
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl editorial-gradient text-on-primary text-sm font-semibold"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-on-surface font-body overflow-hidden flex">

      {/* ── Sidebar ─────────────────────────────────── */}
      <Sidebar />

        {/* ── Main content ────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden p-6 md:p-8">

          {/* Page header */}
          <div className="mb-5 shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate('/dashboard')}
                className="lg:hidden mr-1 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <h1 className="text-xl md:text-3xl font-headline font-semibold tracking-tight">
                Post New <span className="text-primary">Job Vacancy</span>
              </h1>
            </div>
            <p className="text-on-surface-variant text-xs mt-0.5">
              Fill in the details below — used by the AI to shortlist and rank resumes.
            </p>
          </div>

          {/* ── Two-column panels ───────────────────── */}
          <div className="flex justify-evenly gap-8 h-[80%] w-[80%] mx-auto my-auto">

            {/* ── LEFT PANEL: Basic Info + AI scoring fields ── */}
            <div className="flex-1 flex flex-col bg-surface-container rounded-2xl p-5 border border-outline-variant/10 relative overflow-hidden min-w-0">
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Section: Basic Info */}
              <h2 className="text-[10px] font-label text-primary uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
                <span className="w-4 h-px bg-primary/40 inline-block" />
                Basic Info
              </h2>

              <div className="flex flex-col gap-3.5 shrink-0">
                {/* Job Title */}
                <div>
                  <label htmlFor="job-title" className={labelCls}>Job Title</label>
                  <input
                    id="job-title"
                    type="text"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className={inputCls}
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="job-category" className={labelCls}>Category / Department</label>
                  <div className="relative">
                    <select
                      id="job-category"
                      value={form.category}
                      onChange={e => set('category', e.target.value)}
                      className={`${inputCls} appearance-none cursor-pointer`}
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[18px] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Location + Employment Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="job-location" className={labelCls}>Location</label>
                    <input
                      id="job-location"
                      type="text"
                      value={form.location}
                      onChange={e => set('location', e.target.value)}
                      placeholder="e.g. Remote"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="job-type" className={labelCls}>Employment Type</label>
                    <div className="relative">
                      <select
                        id="job-type"
                        value={form.employmentType}
                        onChange={e => set('employmentType', e.target.value)}
                        className={`${inputCls} appearance-none cursor-pointer`}
                      >
                        {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(t => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[18px] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-outline-variant/10 shrink-0" />

              {/* Section: AI Requirements — Experience + Education */}
              <h2 className="text-[10px] font-label text-primary uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
                <span className="w-4 h-px bg-primary/40 inline-block" />
                AI Requirements
                <span className="text-on-surface-variant/40 normal-case tracking-normal font-normal">— scoring</span>
              </h2>

              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div>
                  <label htmlFor="job-exp" className={labelCls}>Min. Experience (yrs)</label>
                  <input
                    id="job-exp"
                    type="number"
                    min={0}
                    max={30}
                    value={form.experienceYears}
                    onChange={e => set('experienceYears', e.target.value)}
                    placeholder="e.g. 3"
                    className={inputCls}
                  />
                  <p className="text-[10px] text-on-surface-variant/50 mt-1 pl-0.5">+20% score boost</p>
                </div>
                <div>
                  <label htmlFor="job-edu" className={labelCls}>Min. Education Level</label>
                  <div className="relative">
                    <select
                      id="job-edu"
                      value={form.educationLevel}
                      onChange={e => set('educationLevel', e.target.value)}
                      className={`${inputCls} appearance-none cursor-pointer`}
                    >
                      {EDU_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[18px] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/50 mt-1 pl-0.5">+5% score boost</p>
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL: Skills + Posting Options + Actions ── */}
            <div className="flex-1 flex flex-col bg-surface-container rounded-2xl p-5 border border-outline-variant/10 relative overflow-hidden min-w-0">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

              {/* Section: Required Skills */}
              <h2 className="text-[10px] font-label text-primary uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
                <span className="w-4 h-px bg-primary/40 inline-block" />
                Required Skills
              </h2>

              <div className="shrink-0 mb-1">
                {/* Tag chips */}
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2.5 max-h-16 overflow-y-auto">
                    {form.skills.map(skill => (
                      <span
                        key={skill}
                        className="flex items-center gap-1 bg-secondary-container text-on-secondary-container text-[11px] px-2.5 py-1 rounded-full font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-on-secondary-container/60 hover:text-on-secondary-container transition-colors"
                          aria-label={`Remove ${skill}`}
                        >
                          <span className="material-symbols-outlined text-[12px]">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    id="job-skills"
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKey}
                    placeholder="Type a skill, press Enter to add"
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-3 py-2 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-all border border-outline-variant/10"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
                <p className="text-[10px] text-on-surface-variant/50 mt-1 pl-0.5">
                  Keywords feed the SBERT semantic matching
                </p>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-outline-variant/10 shrink-0" />

              {/* Section: Job Description */}
              <h2 className="text-[10px] font-label text-primary uppercase tracking-widest mb-3 flex items-center gap-2 shrink-0">
                <span className="w-4 h-px bg-primary/40 inline-block" />
                Job Description
              </h2>
              <div className="shrink-0 mb-1">
                <textarea
                  id="job-description"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  maxLength={MAX_DESC}
                  rows={4}
                  placeholder="Describe the role, responsibilities, and requirements in detail…"
                  className={`${inputCls} resize-none`}
                />
                <p className={`text-[10px] mt-1 pl-0.5 text-right transition-colors ${
                  form.description.length >= MAX_DESC
                    ? 'text-error'
                    : form.description.length >= MAX_DESC * 0.9
                    ? 'text-warning'
                    : 'text-on-surface-variant/50'
                }`}>
                  {form.description.length} / {MAX_DESC}
                </p>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-outline-variant/10 shrink-0" />

              {/* Section: Posting Options */}
              <h2 className="text-[10px] font-label text-primary uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
                <span className="w-4 h-px bg-primary/40 inline-block" />
                Posting Options
              </h2>

              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div>
                  <label htmlFor="job-deadline" className={labelCls}>Application Deadline</label>
                  <input
                    id="job-deadline"
                    type="date"
                    value={form.deadline}
                    onChange={e => set('deadline', e.target.value)}
                    className={`${inputCls} [color-scheme:dark]`}
                  />
                </div>
                <div>
                  <label htmlFor="job-openings" className={labelCls}>Number of Openings</label>
                  <input
                    id="job-openings"
                    type="number"
                    min={1}
                    value={form.openings}
                    onChange={e => set('openings', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Action buttons — pushed to bottom */}
              <div className="mt-auto pt-5 flex gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(true)}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant/20 text-on-surface text-sm font-medium hover:bg-surface-container-high transition-all disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || !form.title}
                  onClick={() => handleSubmit(false)}
                  className="flex-1 py-2.5 rounded-xl editorial-gradient text-on-primary text-sm font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">publish</span>
                      Publish Job
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>{/* end two-column panels */}

        </main>
    </div>
  );
};

export default PostJob;
