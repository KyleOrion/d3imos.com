'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Typography,
  Sheet,
  Alert,
  Link as JoyLink,
} from '@mui/joy';
import Link from 'next/link';
import { LockRounded, PersonRounded, Shield, Google } from '@mui/icons-material';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfaInput, setShowMfaInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        mfaCode: showMfaInput ? mfaCode : undefined,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'MFA_REQUIRED') {
          setShowMfaInput(true);
          setError('Please enter your 2FA code');
        } else {
          setError(result.error);
        }
      } else if (result?.ok) {
        // Redirect to dashboard or callback URL
        const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Sheet
        sx={{
          maxWidth: 400,
          width: '100%',
          p: 4,
          borderRadius: 'lg',
          boxShadow: 'lg',
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography level="h3" sx={{ mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
            Sign in to continue to your account
          </Typography>
        </Box>

        {error && (
          <Alert color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl required sx={{ mb: 2 }}>
            <FormLabel>Username</FormLabel>
            <Input
              startDecorator={<PersonRounded />}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </FormControl>

          <FormControl required sx={{ mb: 2 }}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              startDecorator={<LockRounded />}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </FormControl>

          {showMfaInput && (
            <FormControl required sx={{ mb: 2 }}>
              <FormLabel>2FA Code</FormLabel>
              <Input
                startDecorator={<Shield />}
                placeholder="Enter 6-digit code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                disabled={loading}
                slotProps={{
                  input: {
                    maxLength: 6,
                  },
                }}
              />
              <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                Open your authenticator app to get the code
              </Typography>
            </FormControl>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            sx={{ mb: 2 }}
            loading={loading}
          >
            Sign In
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            <Typography level="body-sm" sx={{ px: 2, color: 'text.secondary' }}>
              OR
            </Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            size="lg"
            startDecorator={<Google />}
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            sx={{ mb: 2 }}
          >
            Continue with Google
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography level="body-sm">
              Don't have an account?{' '}
              <Link href="/auth/signup" passHref legacyBehavior>
                <JoyLink>Sign up</JoyLink>
              </Link>
            </Typography>
          </Box>
        </form>
      </Sheet>
    </Box>
  );
}
