'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import FinEdgeLogo from '@/app/components/FinEdgeLogo';

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

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(countryCodes[0].code);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone, countryCode }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Login failed');

      localStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('username', data.username);
      sessionStorage.setItem('phone', data.phone);
      sessionStorage.setItem('countryCode', data.countryCode);
      sessionStorage.setItem('upiBalance', data.upiBalance || '0');
      sessionStorage.setItem('banks', JSON.stringify(data.banks || []));
      sessionStorage.setItem('transactions', JSON.stringify(data.transactions || []));
      sessionStorage.setItem('comments', JSON.stringify(data.comments || []));
      sessionStorage.setItem('linked', data.linked ? 'true' : 'false');
      router.push('/otp');
    } catch (err) {
      setMessage(err.message || 'Login failed');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <FinEdgeLogo />
      <Paper elevation={3} sx={{ p: 3, width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

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
              value={countryCode}
              label="Code"
              onChange={(e) => setCountryCode(e.target.value)}
              size="small"
            >
              {countryCodes.map((opt) => (
                <MenuItem key={opt.code} value={opt.code}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Phone Number"
            type="tel"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Log In
        </Button>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error">{message}</Alert>
      </Snackbar>
    </Container>
  );
}
