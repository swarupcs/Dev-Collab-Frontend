import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '@/hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await register.mutateAsync(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-pattern relative overflow-hidden">
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
        <div className="card-modern p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {register.isError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                Registration failed. Please try again.
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
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className="input-modern"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={register.isPending}
              className="w-full btn-primary py-3 text-base"
            >
              {register.isPending ? 'Creating account…' : 'Create account'}
            </button>
            
            <div className="text-center">
              <Link to="/login" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Already have an account? <span className="font-semibold">Sign in</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
