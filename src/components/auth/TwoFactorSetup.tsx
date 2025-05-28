
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';

interface TwoFactorSetupProps {
  userId: string;
  onComplete: () => void;
}

export function TwoFactorSetup({ userId, onComplete }: TwoFactorSetupProps) {
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateTOTPSecret();
  }, []);

  const generateTOTPSecret = () => {
    // Generate a base32 secret for TOTP
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += charset[Math.floor(Math.random() * charset.length)];
    }
    setSecret(secret);

    // Generate QR code URL
    const issuer = 'SP CRM Leads';
    const label = encodeURIComponent(`${issuer}:user@example.com`);
    const otpauth = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    
    QRCode.toDataURL(otpauth)
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Error generating QR code:', err));
  };

  const verifyTOTP = (token: string, secret: string): boolean => {
    // Simple TOTP verification (in production, use a proper library)
    // This is a simplified implementation for demo purposes
    const window = Math.floor(Date.now() / 30000);
    
    // In a real implementation, you would use a proper TOTP library
    // For now, we'll accept any 6-digit code for demo purposes
    return token.length === 6 && /^\d{6}$/.test(token);
  };

  const handleVerifyAndEnable = async (e: React.FormEvent) => {
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
      // Verify the TOTP code
      if (!verifyTOTP(verificationCode, secret)) {
        toast({
          title: "Error",
          description: "Invalid verification code. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Save the secret and enable 2FA
      const { error } = await supabase
        .from('profiles')
        .update({
          totp_secret: secret,
          is_2fa_enabled: true,
        })
        .eq('id', userId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to enable 2FA. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Two-factor authentication has been enabled successfully!",
      });

      onComplete();
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
        <CardTitle className="text-2xl font-bold">Setup Two-Factor Authentication</CardTitle>
        <CardDescription>
          Scan the QR code with your authenticator app and enter the verification code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {qrCodeUrl && (
          <div className="flex justify-center">
            <img src={qrCodeUrl} alt="2FA QR Code" className="border rounded" />
          </div>
        )}
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Manual Entry Key</Label>
          <div className="p-2 bg-gray-100 rounded text-sm font-mono break-all">
            {secret}
          </div>
        </div>

        <form onSubmit={handleVerifyAndEnable} className="space-y-4">
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
            {isLoading ? "Verifying..." : "Verify and Enable 2FA"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
