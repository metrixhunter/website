'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function OtpPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const router = useRouter();
  const searchParams = useSearchParams();

  // Demo: OTP is 123456
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar({ open: false, message: '', severity: 'info' });

    try {
      // Simulate network/API call
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (otp === '123456') {
        setSnackbar({ open: true, message: 'OTP verified successfully!', severity: 'success' });
        setTimeout(() => {
          const redirect = searchParams.get('redirect');
          router.replace(redirect || '/accountfound');
        }, 1000);
      } else {
        setSnackbar({ open: true, message: 'Invalid OTP. Please try again.', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error verifying OTP. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{
      display: 'flex', alignItems: 'center', minHeight: '100vh', justifyContent: 'center'
    }}>
      <Paper elevation={3} sx={{
        width: '100%', p: 3, textAlign: 'center', borderRadius: '20px'
      }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
          Enter OTP
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Please enter the 6-digit OTP sent to your registered phone number.
        </Typography>
        <Box component="form" onSubmit={handleVerifyOtp} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="OTP"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/, '').slice(0, 6))}
            fullWidth
            inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
            required
            autoFocus
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || otp.length !== 6}
            fullWidth
            sx={{ fontWeight: 600, borderRadius: 8, mt: 1 }}
          >
            {loading ? <CircularProgress size={22} /> : 'Verify OTP'}
          </Button>
        </Box>
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