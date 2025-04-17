'use client';
import { useState } from 'react';
import { Button, TextField, Typography, Container, Alert } from '@mui/material';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = () => {
    if (name && email && password) {
      const user = { name, email, password };
      localStorage.setItem('user', JSON.stringify(user));
      setSuccess(true);
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '3rem' }}>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>

      {success && <Alert severity="success">Signed up successfully!</Alert>}

      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
    </Container>
  );
}

