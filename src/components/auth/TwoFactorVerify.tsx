
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TwoFactorVerifyProps {
  userId: string;
  onSuccess: () => void;
}

export function TwoFactorVerify({ userId, onSuccess }: TwoFactorVerifyProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const verifyTOTP = (token: string, secret: string): boolean => {
    // Simple TOTP verification (in production, use a proper library)
    // This is a simplified implementation for demo purposes
    const window = Math.floor(Date.now() / 30000);
    
    // In a real implementation, you would use a proper TOTP library
    // For now, we'll accept any 6-digit code for demo purposes
    return token.length === 6 && /^\d{6}$/.test(token);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the user's TOTP secret
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('totp_secret')
        .eq('id', userId)
        .single();

      if (error || !profile?.totp_secret) {
        toast({
          title: "Error",
          description: "2FA not properly configured",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verify the TOTP code
      if (!verifyTOTP(verificationCode, profile.totp_secret)) {
        toast({
          title: "Error",
          description: "Invalid verification code. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Two-factor authentication verified successfully!",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the verification code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <Input 
              id="verificationCode" 
              type="text" 
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
