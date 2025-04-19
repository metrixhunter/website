'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Paper, Typography } from '@mui/material';
import FinEdgeLogo from '@/app/components/FinEdgeLogo'; // Adjust the path if necessary

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setMessage('No user data found. Please sign up first.');
      return;
    }

    // Parse the stored user data
    const parsedUser = JSON.parse(storedUser);

    // Validate email and password
    if (parsedUser.email === email && parsedUser.password === password) {
      // Save login flag
      localStorage.setItem('loggedIn', true);

      alert('Login successful!');
      router.push('/banks'); // Redirect to bank selection page
    } else {
      setMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <Container
      maxWidth="xs"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '1rem',
      }}
    >
      <FinEdgeLogo />

      <Paper elevation={3} style={{ padding: '2rem', width: '100%', marginTop: '1rem' }}>
        <Typography variant="h5" align="center" style={{ marginBottom: '1rem' }}>
          Login
        </Typography>

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {message && (
          <Typography color="error" variant="body2" align="center" style={{ marginTop: '0.5rem' }}>
            {message}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}
          onClick={handleLogin}
        >
          Log In
        </Button>
      </Paper>
    </Container>
  );
}

