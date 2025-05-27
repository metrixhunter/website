'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Container, Paper, Alert, Snackbar } from '@mui/material';
import FinEdgeLogo from '@/app/components/FinEdgeLogo';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password || !emailRegex.test(email)) {
      setErrorMsg('Please enter valid name, email, and password.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
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
      // Fallback: Save to localStorage or IndexedDB (since we can't write to files directly from frontend)
      const failedSignups = JSON.parse(localStorage.getItem('failedSignups') || '[]');
      failedSignups.push({ name, email, password, timestamp: new Date().toISOString() });
      localStorage.setItem('failedSignups', JSON.stringify(failedSignups));

      setErrorMsg('Server unreachable. Signup saved locally. Please try again later.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <FinEdgeLogo />
        <Typography variant="h5" gutterBottom>Sign Up</Typography>

        {success && <Alert severity="success">Signed up successfully! Redirecting...</Alert>}

        <TextField label="Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }} onClick={handleSignup}>
          Sign Up
        </Button>
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="error">{errorMsg}</Alert>
      </Snackbar>
    </Container>
  );
}



