'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Paper, Typography, Snackbar, Alert } from '@mui/material';

export default function ClientComponent({ bankId }) {
  const [phone, setPhone] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [debitCard, setDebitCard] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/user/bank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        bank: bankId,
        accountNumber,
        debitCardNumber: debitCard
      })
    });

    const data = await res.json();

    if (data.success) {
      setMessage('✅ Verification successful!');
      setOpenSnackbar(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    } else {
      setMessage(`❌ ${data.error || 'Verification failed.'}`);
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Verify Your Bank Account</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Phone Number" fullWidth margin="normal" value={phone} onChange={e => setPhone(e.target.value)} required />
          <TextField label="Account Number" fullWidth margin="normal" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
          <TextField label="Debit Card Number" fullWidth margin="normal" value={debitCard} onChange={e => setDebitCard(e.target.value)} required />
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 2 }}>Verify</Button>
        </form>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={message.includes('✅') ? 'success' : 'error'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}


