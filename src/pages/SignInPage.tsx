import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

export default function SignInPage() {
  const navigate = useNavigate();
  const login = useLogin();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

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

        {/* Demo credentials hint */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-center mb-6 text-primary">
          <p>Demo Credentials: <strong>alex@devcollab.io</strong> / <strong>password123</strong></p>
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-modern pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full btn-primary py-3 text-base"
            >
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-card/80 text-muted-foreground">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="btn-secondary" onClick={() => alert('Coming soon!')}>GitHub</button>
              <button type="button" className="btn-secondary" onClick={() => alert('Coming soon!')}>Google</button>
            </div>

            <div className="text-center mt-6">
              <Link to="/signup" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Don't have an account? <span className="font-semibold">Sign up</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
