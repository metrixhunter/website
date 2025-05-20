'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Container, Paper, Alert, Snackbar } from '@mui/material';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleSignup = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password || !emailRegex.test(email)) {
      setErrorMsg('Please enter valid name, email, and password.');
      setOpenSnackbar(true);
      return;
    }

    const newUser = { username: name, email, password };

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.some((user) => user.email === email);
    if (userExists) {
      setErrorMsg('Email already registered. Try logging in.');
      setOpenSnackbar(true);
      return;
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setSuccess(true);

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
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


