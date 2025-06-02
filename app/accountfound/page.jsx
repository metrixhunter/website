'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AccountFoundPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get bank details from sessionStorage
    const bank = sessionStorage.getItem('bank');
    const accountNumber = sessionStorage.getItem('accountNumber');
    const username = sessionStorage.getItem('username');
    // Show last 4 digits only
    const last4 = accountNumber?.slice(-4);

    setUser({
      bank,
      accountNumber,
      username,
      last4,
    });

    // If not found, redirect to dashboard for setup
    if (!bank || !accountNumber) {
      router.replace('/dashboard');
    }
  }, [router]);

  if (!user || !user.bank || !user.accountNumber) return null;

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', p: 3, textAlign: 'center', borderRadius: '20px' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>1 account found</Typography>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            border: '2px solid #1976d2',
            borderRadius: '12px',
            p: 2,
            mb: 2,
            background: '#f8faff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user.bank} - {user.last4}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              background: '#e3f2fd',
              px: 1.5,
              py: 0.5,
              borderRadius: '6px',
              width: 'fit-content',
              color: '#1976d2',
              fontSize: '0.95rem'
            }}
          >
            UPI payments will be received here
          </Typography>
        </Box>
        <Button
          variant="text"
          color="primary"
          sx={{ textTransform: 'none', mb: 1 }}
          onClick={() => router.push('/dashboard')}
        >
          + Add Bank account
        </Button>
        <Divider sx={{ my: 2 }} />
        <Button
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: 8,
            fontWeight: 600,
            px: 2
          }}
          disabled
        >
          + Add Rupay Credit Card
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 2, color: '#888' }}>
          Now make merchant payments from your credit card through UPI
        </Typography>
      </Paper>
    </Container>
  );
}