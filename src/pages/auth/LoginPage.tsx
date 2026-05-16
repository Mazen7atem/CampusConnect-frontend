import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogIn, Zap, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/entities/session';
import { useLoginMutation } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// ─── Dev Credentials ─────────────────────────────────────────────────
const DEV_EMAIL = 'maya.admin@campusconnect.test';
const DEV_PASSWORD = 'Admin123!';

// ─── Login Page ──────────────────────────────────────────────────────
export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: result.token, user: result.user }));
      navigate('/events-queue', { replace: true });
    } catch (err) {
      const apiError = err as { status?: number; data?: { message?: string } };
      if (apiError.status === 401 || apiError.status === 403) {
        setError('Invalid email or password. Please try again.');
      } else if (apiError.data?.message) {
        setError(apiError.data.message);
      } else {
        setError('Something went wrong. Please try again later.');
      }
    }
  };

  const handleDevLogin = async () => {
    setEmail(DEV_EMAIL);
    setPassword(DEV_PASSWORD);
    setError(null);

    try {
      const result = await login({
        email: DEV_EMAIL,
        password: DEV_PASSWORD,
      }).unwrap();
      dispatch(setCredentials({ token: result.token, user: result.user }));
      navigate('/events-queue', { replace: true });
    } catch (err) {
      const apiError = err as { status?: number; data?: { message?: string } };
      setError(apiError.data?.message ?? 'Dev login failed. Is the backend running?');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-secondary-container/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md shadow-level-2 border-outline-variant animate-scale-in">
        <CardHeader className="space-y-4 text-center pb-2">
          {/* Logo */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-container font-bold text-white text-lg shadow-lg">
            CC
          </div>

          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              CampusConnect
            </CardTitle>
            <CardDescription className="mt-1">
              Sign in to the Admin Dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-error/30 bg-error-container/30 p-3 text-sm text-error animate-fade-in">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@campusconnect.test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isLoading}
                className="h-11"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-0">
          <Separator />

          {/* Dev Helper */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDevLogin}
            disabled={isLoading}
            className="w-full gap-2 text-muted-foreground hover:text-foreground text-xs h-9"
          >
            <Zap className="h-3.5 w-3.5" />
            Quick Login (Dev)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
