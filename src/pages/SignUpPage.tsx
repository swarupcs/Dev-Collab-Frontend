import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
  const navigate = useNavigate();
  const register = useRegister();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    
    try {
      await register.mutateAsync({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      navigate('/dashboard');
    } catch (err) {
      const error = err as { response?: { status?: number } };
      if (error?.response?.status === 409) {
        setErrorMsg('Email address is already in use');
      } else {
        setErrorMsg('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-pattern relative overflow-hidden py-12">
      {/* Background glow effects */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="max-w-md w-full mx-4 relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-glow mx-auto mb-4">
            DC
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Create Account
          </h1>
          <p className="text-muted-foreground mt-2">Join Dev-Collab and start collaborating</p>
        </div>

        {/* Form Card */}
        <div className="card-modern p-8 mb-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {(errorMsg || register.isError) && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {errorMsg || 'Registration failed. Please try again.'}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground/80 mb-1.5">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  className="input-modern"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground/80 mb-1.5">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  className="input-modern"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="input-modern"
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
                  minLength={6}
                  className="input-modern pr-10"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground/80 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="input-modern pr-10"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={register.isPending}
              className="w-full btn-primary py-3 text-base"
            >
              {register.isPending ? 'Creating account…' : 'Create account'}
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
              <Link to="/signin" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Already have an account? <span className="font-semibold">Sign in</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Stats and Links */}
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5"><span className="font-semibold text-foreground">10K+</span> Developers</div>
            <div className="flex items-center gap-1.5"><span className="font-semibold text-foreground">500+</span> Projects</div>
            <div className="flex items-center gap-1.5"><span className="font-semibold text-foreground">50+</span> Countries</div>
          </div>
          <div className="text-xs text-muted-foreground/60 space-x-3">
            <Link to="#" className="hover:text-muted-foreground">Terms of Service</Link>
            <span>•</span>
            <Link to="#" className="hover:text-muted-foreground">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
