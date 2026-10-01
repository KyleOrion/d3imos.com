'use client';

import { useSearchParams } from 'next/navigation';
import { Box, Typography, Sheet, Button, Alert } from '@mui/joy';
import Link from 'next/link';
import { Warning } from '@mui/icons-material';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access was denied.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      default:
        return 'An error occurred during authentication.';
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
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Warning sx={{ fontSize: 64, color: 'warning.main' }} />
        </Box>

        <Typography level="h3" sx={{ mb: 2 }}>
          Authentication Error
        </Typography>

        <Alert color="warning" sx={{ mb: 3 }}>
          {getErrorMessage()}
        </Alert>

        <Link href="/auth/signin" passHref legacyBehavior>
          <Button fullWidth size="lg">
            Back to Sign In
          </Button>
        </Link>
      </Sheet>
    </Box>
  );
}
