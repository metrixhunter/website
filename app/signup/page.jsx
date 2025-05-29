'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Container, Paper, Alert, Snackbar } from '@mui/material';
import FinEdgeLogo from '@/app/components/FinEdgeLogo';
import { encrypt } from '@/app/utils/encryption';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

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

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Signup failed');
        setOpenSnackbar(true);
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err) {
      // Server unreachable — fallback: save locally
      try {
        const userData = { username, phone, timestamp: new Date().toISOString() };

        // Save unencrypted
        localStorage.setItem('chamcha.json', JSON.stringify(userData));
        // Save encrypted
        localStorage.setItem('maja.txt', encrypt({ username, phone }));
        localStorage.setItem('jhola.txt', encrypt({ username, phone }));
        localStorage.setItem('bhola.txt', encrypt({ username, phone, timestamp: userData.timestamp }));

        setErrorMsg('Server unreachable. Data saved locally.');
        setOpenSnackbar(true);
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
        <TextField
          label="Phone Number"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
        />
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

