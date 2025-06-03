'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function BalancePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const bank = sessionStorage.getItem('bank');
    const accountNumber = sessionStorage.getItem('accountNumber');
    if (!username || !bank || !accountNumber) {
      router.replace('/dashboard');
      return;
    }
    setUser({ username, bank, accountNumber });
  }, [router]);

  return (
    <Container maxWidth="xs" sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Paper elevation={3} sx={{
        width: '100%',
        p: 4,
        borderRadius: 4,
        bgcolor: '#fff',
        textAlign: 'center'
      }}>
        <AccountBalanceWalletIcon sx={{ fontSize: 54, color: '#1976d2', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Account Summary
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <b>Bank:</b> {user?.bank}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <b>Account Number:</b> ****{user?.accountNumber?.slice(-4)}
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary">
          (No transaction history available.)
        </Typography>
      </Paper>
    </Container>
  );
}