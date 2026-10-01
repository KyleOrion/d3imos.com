'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Typography,
  Sheet,
  Alert,
  Modal,
  ModalDialog,
  FormControl,
  FormLabel,
  Input,
  CircularProgress,
} from '@mui/joy';
import { Shield, Logout, CheckCircle, Warning } from '@mui/icons-material';
import Image from 'next/image';

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleSetupMFA = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mfa/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to setup MFA');
        return;
      }

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setShowMfaModal(true);
    } catch (err) {
      setError('An error occurred while setting up MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMFA = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mfa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: mfaCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to verify MFA code');
        return;
      }

      setSuccess('2FA has been enabled successfully!');
      setShowMfaModal(false);
      setMfaCode('');

      // Update session to reflect MFA status
      await update();

      // Refresh the page to show updated status
      router.refresh();
    } catch (err) {
      setError('An error occurred while verifying MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mfa/disable', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to disable MFA');
        return;
      }

      setSuccess('2FA has been disabled');
      await update();
      router.refresh();
    } catch (err) {
      setError('An error occurred while disabling MFA');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 4,
      }}
    >
      <Sheet
        sx={{
          maxWidth: 800,
          mx: 'auto',
          p: 4,
          borderRadius: 'lg',
          boxShadow: 'lg',
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography level="h2">Dashboard</Typography>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<Logout />}
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          >
            Sign Out
          </Button>
        </Box>

        {error && (
          <Alert color="danger" sx={{ mb: 2 }} startDecorator={<Warning />}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="success" sx={{ mb: 2 }} startDecorator={<CheckCircle />}>
            {success}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <Typography level="h4" sx={{ mb: 2 }}>
            Profile Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>
              <strong>Username:</strong> {session.user?.name}
            </Typography>
            <Typography>
              <strong>Email:</strong> {session.user?.email}
            </Typography>
          </Box>
        </Card>

        <Card>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Shield sx={{ mr: 1 }} />
            <Typography level="h4">Two-Factor Authentication (2FA)</Typography>
          </Box>

          <Typography sx={{ mb: 2 }}>
            Add an extra layer of security to your account by enabling two-factor authentication.
          </Typography>

          {session.user?.mfaEnabled ? (
            <Box>
              <Alert color="success" sx={{ mb: 2 }} startDecorator={<CheckCircle />}>
                2FA is currently <strong>enabled</strong> on your account
              </Alert>
              <Button
                color="danger"
                onClick={handleDisableMFA}
                loading={loading}
              >
                Disable 2FA
              </Button>
            </Box>
          ) : (
            <Box>
              <Alert color="warning" sx={{ mb: 2 }} startDecorator={<Warning />}>
                2FA is currently <strong>disabled</strong>
              </Alert>
              <Button
                color="primary"
                startDecorator={<Shield />}
                onClick={handleSetupMFA}
                loading={loading}
              >
                Enable 2FA
              </Button>
            </Box>
          )}
        </Card>
      </Sheet>

      <Modal open={showMfaModal} onClose={() => setShowMfaModal(false)}>
        <ModalDialog sx={{ maxWidth: 500 }}>
          <Typography level="h4" sx={{ mb: 2 }}>
            Set up Two-Factor Authentication
          </Typography>

          <Typography level="body-sm" sx={{ mb: 2 }}>
            1. Install an authenticator app like Google Authenticator or Authy on your phone
          </Typography>

          <Typography level="body-sm" sx={{ mb: 2 }}>
            2. Scan this QR code with your authenticator app:
          </Typography>

          {qrCode && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <img src={qrCode} alt="QR Code" style={{ maxWidth: '100%' }} />
            </Box>
          )}

          <Typography level="body-sm" sx={{ mb: 1 }}>
            Or manually enter this secret key:
          </Typography>
          <Input
            value={secret}
            readOnly
            sx={{ mb: 3, fontFamily: 'monospace' }}
          />

          <Typography level="body-sm" sx={{ mb: 2 }}>
            3. Enter the 6-digit code from your authenticator app:
          </Typography>

          <FormControl sx={{ mb: 3 }}>
            <Input
              placeholder="000000"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              slotProps={{
                input: {
                  maxLength: 6,
                },
              }}
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setShowMfaModal(false);
                setMfaCode('');
                setError('');
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleVerifyMFA}
              loading={loading}
              disabled={mfaCode.length !== 6}
            >
              Verify & Enable
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
