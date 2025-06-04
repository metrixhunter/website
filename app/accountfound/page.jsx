'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AccountFoundPage() {
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [linkedBanks, setLinkedBanks] = useState([]);
  const [selectedBankIdx, setSelectedBankIdx] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    // Only show this page if NOT already linked
    const linked = sessionStorage.getItem('linked');
    if (linked !== 'true') {
      router.replace('/dashboard');
      return;
    }

    // Load previously linked banks from localStorage
    let banks = [];
    const raw = localStorage.getItem('linkedBank');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        banks = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        banks = [];
      }
    }

    if (!banks.length) {
      // If no linked banks, redirect to dashboard
      router.replace('/dashboard');
      return;
    }
    setLinkedBanks(banks);

    // Load current session user info
    const bank = sessionStorage.getItem('bank');
    const accountNumber = sessionStorage.getItem('accountNumber');
    const username = sessionStorage.getItem('username');
    const last4 = accountNumber?.slice(-4);
    setUser(bank && accountNumber ? { bank, accountNumber, username, last4 } : null);
  }, [router]);

  const handleProceed = () => {
    if (selectedBankIdx >= 0) {
      const bank = linkedBanks[selectedBankIdx];
      // Set this bank as the current session
      sessionStorage.setItem('bank', bank.bank);
      sessionStorage.setItem('accountNumber', bank.accountNumber);
      sessionStorage.setItem('debitCardNumber', bank.debitCardNumber);
      sessionStorage.setItem('username', bank.username);
      sessionStorage.setItem('phone', bank.phone);
      sessionStorage.setItem('countryCode', bank.countryCode);
      sessionStorage.setItem('linked', 'true');
      router.replace('/dashboard');
    }
  };

  if (!linkedBanks.length) return null; // While checking or if no banks, don't render

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', p: 3, textAlign: 'center', borderRadius: '20px' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Linked Account(s) Found
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 2, textAlign: 'left' }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Select a bank to proceed
          </Typography>
          <List>
            {linkedBanks.map((bank, idx) => (
              <ListItem key={idx} disableGutters>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedBankIdx === idx}
                      onChange={() => setSelectedBankIdx(idx)}
                      color="primary"
                    />
                  }
                  label={`${bank.bank || 'Bank'} - ${bank.accountNumber?.slice(-4) || 'XXXX'}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mb: 2,
            borderRadius: 8,
            fontWeight: 600,
            px: 2,
            bgcolor: selectedBankIdx >= 0 ? undefined : '#b0bec5',
            color: selectedBankIdx >= 0 ? '#fff' : '#ececec',
            cursor: selectedBankIdx >= 0 ? 'pointer' : 'not-allowed',
            pointerEvents: selectedBankIdx >= 0 ? 'auto' : 'none',
          }}
          disabled={selectedBankIdx < 0}
          onClick={handleProceed}
        >
          Proceed
        </Button>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
