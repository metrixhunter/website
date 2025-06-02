'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import FinEdgeLogo from '@/app/components/FinEdgeLogo';
import { encrypt } from '@/app/utils/encryption';

const countryCodes = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+86', label: 'China (+86)' },
];

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(countryCodes[0].code);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const redirectAfterSignup = () => {
    const bank = sessionStorage.getItem('bank');
    const accountNumber = sessionStorage.getItem('accountNumber');
    const debitCardNumber = sessionStorage.getItem('debitCardNumber');
    if (bank && accountNumber && debitCardNumber) {
      router.push('/accountfound');
    } else {
      router.push('/dashboard');
    }
  };

  const handleSignup = async () => {
    if (!username.trim()) {
      setErrorMsg('Please enter a username.');
      setOpenSnackbar(true);
      return;
    }
    if (!phone.match(/^\d{10}$/)) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      setOpenSnackbar(true);
      return;
    }
    if (!countryCode) {
      setErrorMsg('Please select your country code.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone, countryCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Signup failed');
        setOpenSnackbar(true);
      } else {
        setSuccess(true);
        // Simulate bank assignment (in real app, these come from backend)
        if (data.bank && data.accountNumber && data.debitCardNumber) {
          sessionStorage.setItem('bank', data.bank);
          sessionStorage.setItem('accountNumber', data.accountNumber);
          sessionStorage.setItem('debitCardNumber', data.debitCardNumber);
        }
        setTimeout(() => redirectAfterSignup(), 2000);
      }
    } catch (err) {
      // Server unreachable — fallback: save locally
      try {
        const userData = { username, phone, countryCode, timestamp: new Date().toISOString() };
        localStorage.setItem('chamcha.json', JSON.stringify(userData));
        localStorage.setItem('maja.txt', encrypt({ username, phone, countryCode }));
        localStorage.setItem('jhola.txt', encrypt({ username, phone, countryCode }));
        localStorage.setItem('bhola.txt', encrypt({ username, phone, countryCode, timestamp: userData.timestamp }));

        setErrorMsg('Server unreachable. Data saved locally.');
        setOpenSnackbar(true);
        setTimeout(() => redirectAfterSignup(), 2000);
      } catch (error) {
        setErrorMsg('Failed to save data locally.');
        setOpenSnackbar(true);
      }
    }
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <FinEdgeLogo />
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        {success && <Alert severity="success">Signed up successfully! Redirecting...</Alert>}

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Box display="flex" gap={1} alignItems="center">
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel id="country-code-label">Code</InputLabel>
            <Select
              labelId="country-code-label"
              id="country-code"
              value={countryCode}
              label="Code"
              onChange={e => setCountryCode(e.target.value)}
              size="small"
            >
              {countryCodes.map((option) => (
                <MenuItem value={option.code} key={option.code}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
            sx={{ flex: 1 }}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}
          onClick={handleSignup}
        >
          Sign Up
        </Button>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={success ? "success" : "error"}>{success ? "Signed up successfully! Redirecting..." : errorMsg}</Alert>
      </Snackbar>
    </Container>
  );
}