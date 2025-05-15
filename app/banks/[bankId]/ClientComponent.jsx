'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Paper, Typography, Snackbar, Alert } from '@mui/material';

export default function ClientComponent({ bankId }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [debitCard, setDebitCard] = useState('');
  const [accountExists, setAccountExists] = useState(false);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const mockAccounts = {
    sbi: ['123456', '111111'],
    hdfc: ['222222'],
    icici: ['333333'],
    axis: ['444444'],
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    if (!accountNumber.match(/^\d+$/)) {
      setMessage('Invalid account number format.');
      setOpenSnackbar(true);
      return;
    }

    if (mockAccounts[bankId]?.includes(accountNumber)) {
      setAccountExists(true);
      setMessage('✅ Account verified! Please proceed to enter your debit card.');
    } else {
      setMessage('❌ Account not found. Please try again.');
    }
    setOpenSnackbar(true);
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();

    if (!debitCard.match(/^\d{16}$/)) {
      setMessage('❌ Invalid debit card number. Please try again.');
      setOpenSnackbar(true);
      return;
    }

    setMessage('✅ Debit card verified successfully!');
    setOpenSnackbar(true);

    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Verify Your Account</Typography>

        {!accountExists ? (
          <form onSubmit={handleAccountSubmit}>
            <TextField label="Account Number" fullWidth margin="normal" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
            <Button variant="contained" color="primary" fullWidth type="submit">Check Account</Button>
          </form>
        ) : (
          <form onSubmit={handleCardSubmit}>
            <TextField label="Debit Card Number" fullWidth margin="normal" value={debitCard} onChange={(e) => setDebitCard(e.target.value)} required />
            <Button variant="contained" color="primary" fullWidth type="submit">Verify Debit Card</Button>
          </form>
        )}
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={message.includes('✅') ? 'success' : 'error'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}



