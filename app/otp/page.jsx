'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AccountFoundPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const router = useRouter();

  useEffect(() => {
    // Get details from sessionStorage
    const bank = sessionStorage.getItem('bank');
    const accountNumber = sessionStorage.getItem('accountNumber');
    const debitCardNumber = sessionStorage.getItem('debitCardNumber');
    const username = sessionStorage.getItem('username');
    const phone = sessionStorage.getItem('phone');
    const countryCode = sessionStorage.getItem('countryCode');
    const linked = sessionStorage.getItem('linked'); // may be string "true" or "false"

    // Show last 4 digits only
    const last4 = accountNumber?.slice(-4);

    setUser({
      bank,
      accountNumber,
      debitCardNumber,
      username,
      phone,
      countryCode,
      last4,
      linked,
    });

    // If not found, redirect to dashboard for setup
    if (!bank || !accountNumber || !username || !phone || !countryCode || !debitCardNumber) {
      router.replace('/dashboard');
    }
  }, [router]);

  if (!user || !user.bank || !user.accountNumber) return null;

  const handleLinkBank = async () => {
    setLoading(true);
    setSnackbar({ open: false, message: '', severity: 'info' });

    try {
      const res = await fetch('/api/auth/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          phone: user.phone,
          countryCode: user.countryCode,
          bank: user.bank,
          accountNumber: user.accountNumber,
          debitCardNumber: user.debitCardNumber,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem('linked', 'true');
        setSnackbar({ open: true, message: 'Bank linked successfully!', severity: 'success' });
        setTimeout(() => router.replace('/dashboard'), 1000);
      } else {
        setSnackbar({ open: true, message: data.message || 'Failed to link account.', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error linking bank. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', p: 3, textAlign: 'center', borderRadius: '20px' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          1 account found
        </Typography>
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
          variant="contained"
          color="primary"
          sx={{ mb: 2, borderRadius: 8, fontWeight: 600, px: 2 }}
          onClick={handleLinkBank}
          disabled={user.linked === 'true' || loading}
        >
          {loading ? <CircularProgress size={22} /> : user.linked === 'true' ? 'Bank Linked' : 'Link this Bank'}
        </Button>
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}