import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Moon, Sun, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast.success(t('success'), { description: 'Welcome back!' });
        navigate('/dashboard');
      } else {
        toast.error(t('error'), { description: t('invalid_credentials') });
      }
    } catch (error) {
      toast.error(t('error'), { description: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <div className="w-24 h-24 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
            <span className="text-5xl font-bold text-primary-foreground">E</span>
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            {t('app_name')}
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-2">
            {t('ejust')}
          </p>
          <p className="text-primary-foreground/60 max-w-md">
            Manage students, events, facilities, and clubs all in one powerful admin dashboard.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-4 text-primary-foreground/80">
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-sm">Students</p>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm">Clubs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Top Bar */}
        <div className="flex items-center justify-end gap-2 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                <span className={language === 'en' ? 'font-bold' : ''}>English</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                <span className={language === 'ar' ? 'font-bold' : ''}>العربية</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl font-bold text-primary-foreground">E</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">{t('app_name')}</h1>
            </div>

            <div className="text-center lg:text-start">
              <h2 className="text-3xl font-bold text-foreground">{t('sign_in')}</h2>
              <p className="mt-2 text-muted-foreground">{t('sign_in_subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">{t('username')}</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="pr-10 rtl:pr-4 rtl:pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rtl:right-auto rtl:left-3"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    {t('remember_me')}
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-sm text-primary hover:underline"
                >
                  {t('forgot_password')}
                </button>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t('sign_in')
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="font-medium">System Admin:</span> admin / admin123</p>
                <p><span className="font-medium">Events Admin:</span> events / events123</p>
                <p><span className="font-medium">Sports Admin:</span> sports / sports123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('forgot_password')}</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input id="reset-email" type="email" placeholder="admin@ejust.edu.eg" />
            </div>
            <Button className="w-full" onClick={() => {
              toast.success('Password reset link sent!');
              setForgotPasswordOpen(false);
            }}>
              Send Reset Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
