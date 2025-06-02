'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
} from '@mui/material';

export default function OtpPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only run on client-side
    setHydrated(true);
    const storedPhone = typeof window !== 'undefined' ? sessionStorage.getItem('phone') : '';
    const storedCountryCode = typeof window !== 'undefined' ? sessionStorage.getItem('countryCode') : '';
    setPhone(storedPhone || '');
    setCountryCode(storedCountryCode || '');
  }, []);

  if (!hydrated) return null; // Don't render on SSR

  const maskedPhone =
    phone
      ? `${countryCode} ${phone.substring(0, 2)}******${phone.substring(8)}`
      : '';

  const handleProceed = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/banks');
    }, 1000);
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ width: '100%', padding: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Enter the OTP sent to
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {maskedPhone}
        </Typography>
        <Box display="flex" justifyContent="center" gap={1} mb={2}>
          {[0, 1, 2, 3].map((i) => (
            <TextField
              key={i}
              value={otp[i] || ''}
              inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: 24, width: 40 } }}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/, '');
                setOtp((prev) => (prev.substring(0, i) + val + prev.substring(i + 1)));
              }}
              sx={{ width: 50 }}
            />
          ))}
        </Box>
        <Typography color="success.main" sx={{ mb: 2 }}>
          OTP Sent <span style={{ color: 'green', fontWeight: 'bold' }}>●</span>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={otp.length < 4 || loading}
          onClick={handleProceed}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Proceed'}
        </Button>
        <Typography variant="body2" color="text.secondary">
          Didn&apos;t receive it? Retry in 00:20
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          On proceeding, we will securely find and add your bank accounts to enable UPI.
        </Typography>
      </Paper>
    </Container>
  );
}