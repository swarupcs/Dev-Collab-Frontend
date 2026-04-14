import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login.mutateAsync(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-pattern relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="max-w-md w-full mx-4 relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-glow mx-auto mb-4">
            DC
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to your Dev-Collab workspace</p>
        </div>

        {/* Form Card */}
        <div className="card-modern p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {login.isError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                Login failed. Please check your credentials.
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="input-modern"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="input-modern"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full btn-primary py-3 text-base"
            >
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </button>
            
            <div className="text-center">
              <Link to="/register" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Don't have an account? <span className="font-semibold">Sign up</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
