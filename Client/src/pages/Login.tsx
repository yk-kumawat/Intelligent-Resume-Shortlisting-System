import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      localStorage.setItem('irss_token', data.token);
      localStorage.setItem('irss_user', JSON.stringify(data.user));
      navigate(data.user.role === 'hr' ? '/dashboard' : '/applicant');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant/10">

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="font-headline text-2xl font-semibold text-on-surface mb-1">Sign in</h1>
            <p className="text-on-surface-variant text-sm">Welcome back to your workspace</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-error-container/20 border border-error/20 text-error text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs text-on-surface">Email</label>
              <input
                id="login-email"
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
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs text-on-surface">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:opacity-80 transition-opacity">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              style={{ height: '46px' }}
              className={`w-full mt-1 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${isLoading
                ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                : 'editorial-gradient text-on-primary hover:brightness-110 active:scale-[0.98]'
                }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

        </div>{/* end card */}

        <p className="text-center mt-6 text-sm text-on-surface-variant">
          No account?{' '}
          <Link to="/signup" className="text-primary hover:opacity-80 transition-opacity font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
