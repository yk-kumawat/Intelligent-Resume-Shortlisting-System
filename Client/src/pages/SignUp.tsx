import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

type Role = '' | 'hr' | 'applicant';

const getStrength = (pwd: string) => {
  if (!pwd) return null;
  if (pwd.length < 6) return { label: 'Weak', color: 'bg-error', width: 'w-1/3' };
  if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd))
    return { label: 'Medium', color: 'bg-tertiary', width: 'w-2/3' };
  return { label: 'Strong', color: 'bg-primary', width: 'w-full' };
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (!role) return setError('Please select a role.');

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    navigate(role === 'hr' ? '/dashboard' : '/applicant');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant/10">

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="font-headline text-2xl font-semibold text-on-surface mb-1">Create account</h1>
            <p className="text-on-surface-variant text-sm">Start your journey today</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-error-container/20 border border-error/20 text-error text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-name" className="text-xs text-on-surface">Full Name</label>
              <input
                id="signup-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-xl border border-outline-variant/10 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/70 text-sm"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-email" className="text-xs text-on-surface">Email</label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-xl border border-outline-variant/10 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/70 text-sm"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-password" className="text-xs text-on-surface">Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full bg-surface-container-low text-on-surface px-4 pr-11 py-3 rounded-xl border border-outline-variant/10 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/70 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-6.5 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
                  aria-label="Toggle password"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {/* Strength bar */}
              {strength && (
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-0.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <span className="text-[11px] text-on-surface-variant shrink-0">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-confirm" className="text-xs text-on-surface">Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className={`w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-xl border transition-all placeholder:text-on-surface-variant/70 text-sm focus:outline-none focus:ring-1 ${confirmPassword && confirmPassword !== password
                  ? 'border-error/30 focus:ring-error/20'
                  : 'border-outline-variant/10 focus:border-primary/40 focus:ring-primary/20'
                  }`}
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-role" className="text-xs text-on-surface">Role</label>
              <div className="relative">
                <select
                  id="signup-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full bg-surface-container-low text-on-surface px-4 pr-10 py-3 rounded-xl border border-outline-variant/10 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer text-sm"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" disabled className="bg-surface-container text-on-surface-variant">Select your role</option>
                  <option value="hr" className="bg-surface-container text-on-surface">HR / Recruiter</option>
                  <option value="applicant" className="bg-surface-container text-on-surface">Applicant / Job Seeker</option>
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/40 text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={isLoading}
              style={{ height: '46px' }}
              className={`w-full mt-1 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${isLoading
                ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                : 'editorial-gradient text-on-primary hover:brightness-110 active:scale-[0.98]'
                }`}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

        </div>{/* end card */}

        <p className="text-center mt-6 text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:opacity-80 transition-opacity font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
