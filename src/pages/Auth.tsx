
import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { TwoFactorVerify } from '@/components/auth/TwoFactorVerify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type AuthView = 'login' | 'signup' | '2fa-setup' | '2fa-verify';

interface AuthState {
  view: AuthView;
  userId?: string;
  requiresTwoFactor?: boolean;
}

const Auth = () => {
  const [authState, setAuthState] = useState<AuthState>({ view: 'login' });

  const handleAuthSuccess = (userId: string, requiresTwoFactor: boolean = false) => {
    if (requiresTwoFactor) {
      setAuthState({ view: '2fa-verify', userId, requiresTwoFactor });
    } else {
      // User is fully authenticated, will be redirected by App.tsx
    }
  };

  const handle2FASetupComplete = () => {
    // After 2FA setup, user is fully authenticated
    setAuthState({ view: 'login' });
  };

  const renderAuthForm = () => {
    switch (authState.view) {
      case 'signup':
        return (
          <SignUpForm 
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setAuthState({ view: 'login' })}
          />
        );
      case '2fa-setup':
        return (
          <TwoFactorSetup 
            userId={authState.userId!}
            onComplete={handle2FASetupComplete}
          />
        );
      case '2fa-verify':
        return (
          <TwoFactorVerify 
            userId={authState.userId!}
            onSuccess={() => setAuthState({ view: 'login' })}
          />
        );
      default:
        return (
          <LoginForm 
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={() => setAuthState({ view: 'signup' })}
            onSetup2FA={(userId) => setAuthState({ view: '2fa-setup', userId })}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">SP CRM Leads</h1>
          <p className="mt-2 text-gray-400">Lead management simplified</p>
        </div>
        {renderAuthForm()}
      </div>
    </div>
  );
};

export default Auth;
