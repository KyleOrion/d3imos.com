'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { LockRounded, PersonRounded, EmailRounded } from '@mui/icons-material';

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Registration successful, redirect to login
      router.push('/auth/signin?registered=true');
    } catch (err) {
      setError('An error occurred during registration');
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
            Create Account
          </Typography>
          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
            Sign up to get started
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
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
              3-20 characters, letters, numbers, and underscore only
            </Typography>
          </FormControl>

          <FormControl required sx={{ mb: 2 }}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              startDecorator={<EmailRounded />}
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </FormControl>

          <FormControl required sx={{ mb: 2 }}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              startDecorator={<LockRounded />}
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
              At least 8 characters
            </Typography>
          </FormControl>

          <FormControl required sx={{ mb: 3 }}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              startDecorator={<LockRounded />}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            size="lg"
            sx={{ mb: 2 }}
            loading={loading}
          >
            Sign Up
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography level="body-sm">
              Already have an account?{' '}
              <Link href="/auth/signin" passHref legacyBehavior>
                <JoyLink>Sign in</JoyLink>
              </Link>
            </Typography>
          </Box>
        </form>
      </Sheet>
    </Box>
  );
}
