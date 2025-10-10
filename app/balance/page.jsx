'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Stack,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaidIcon from '@mui/icons-material/Paid';
import LinkIcon from '@mui/icons-material/Link';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function BalancePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get all user data from sessionStorage
    const username = sessionStorage.getItem('username');
    const phone = sessionStorage.getItem('phone');
    const countryCode = sessionStorage.getItem('countryCode');
    const upiBalance = Number(sessionStorage.getItem('upiBalance')) || 0;
    const banks = JSON.parse(sessionStorage.getItem('banks') || '[]');
    const txns = JSON.parse(sessionStorage.getItem('transactions') || '[]');

    if (!username) {
      // router.replace('/login'); // redirect if not logged in
      return;
    }

    setUser({
      username,
      phone,
      countryCode,
      upiBalance,
      banks,
    });
    setTransactions(txns);
  }, []);

  const handleBankClick = (bankId) => {
    router.push(`/banks/${bankId}`);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          borderRadius: 4,
          bgcolor: '#fff',
          textAlign: 'center',
          px: 0,
          py: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Balance & History
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            mb: 2,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            View and manage your linked bank accounts
          </Typography>
          <Button
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.78rem', borderRadius: 2 }}
            onClick={() => router.push('/banks')}
          >
            Add Bank A/c
          </Button>
        </Box>

        <Divider />

        <List>
          {/* UPI Balance */}
          {user?.upiBalance > 0 && (
            <ListItem
              sx={{
                py: 1.4,
                px: 2,
                bgcolor: '#e2f6ff',
                mb: 0.5,
                border: '2px solid #1976d2',
                borderRadius: 2,
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'white', border: '1px solid #e3e3e3' }}>
                  <AccountBalanceWalletIcon color="primary" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: '#1976d2' }}
                    >
                      UPI Balance
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#1976d2',
                        background: '#e3f2fd',
                        px: 1.2,
                        py: 0.2,
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    >
                      ₹{user.upiBalance}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Linked UPI
                  </Typography>
                }
              />
            </ListItem>
          )}

          {/* Linked banks */}
          {user?.banks?.map((bank, idx) => (
            <ListItem
              key={idx}
              alignItems="flex-start"
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="go"
                  onClick={() => handleBankClick(bank.bankName.toLowerCase())}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              }
              button
              onClick={() => handleBankClick(bank.bankName.toLowerCase())}
              sx={{
                py: 1.4,
                px: 2,
                bgcolor: '#e2f6ff',
                mb: 0.5,
                border: '2px solid #1976d2',
                borderRadius: 2,
                '&:hover': { bgcolor: '#d0ecff' },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'white', border: '1px solid #e3e3e3' }}>
                  <AccountBalanceIcon color="primary" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: '#1976d2' }}
                    >
                      {bank.bankName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#1976d2',
                        background: '#e3f2fd',
                        px: 1.2,
                        py: 0.2,
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    >
                      ****{bank.bankDetails.accountNumber.slice(-4)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Bank Account
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        {/* Transaction History */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Transaction History
        </Typography>
        <Divider />
        <List>
          {transactions.length > 0 ? (
            transactions.map((txn, idx) => (
              <ListItem key={idx} sx={{ py: 1, px: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#e3f2fd' }}>
                    <ReceiptIcon color="primary" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {txn.type} — ₹{txn.amount}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {txn.date} {txn.note ? `| ${txn.note}` : ''}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              No transactions available.
            </Typography>
          )}
        </List>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1} px={2}>
          <Box
            sx={{
              py: 1,
              px: 2,
              bgcolor: '#e3f2fd',
              borderRadius: 2,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CreditCardIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary" flex={1}>
              Credit Card — Get best cashback & rewards!
            </Typography>
            <Button
              size="small"
              sx={{ minWidth: 0, fontSize: '0.78rem' }}
              disabled
            >
              Apply Now
            </Button>
          </Box>
          <Box
            sx={{
              py: 1,
              px: 2,
              bgcolor: '#e3f2fd',
              borderRadius: 2,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <PaidIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary" flex={1}>
              Personal Loan — Get up to ₹5 lacs!
            </Typography>
            <Button
              size="small"
              sx={{ minWidth: 0, fontSize: '0.78rem' }}
              disabled
            >
              Get Now
            </Button>
          </Box>
          <Box
            sx={{
              py: 1,
              px: 2,
              bgcolor: '#e3f2fd',
              borderRadius: 2,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <LinkIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary" flex={1}>
              Link Your Bank Account — Super fast UPI money transfers
            </Typography>
            <Button
              size="small"
              onClick={() => router.push('/banks')}
              sx={{ minWidth: 0, fontSize: '0.78rem' }}
            >
              Proceed
            </Button>
          </Box>
        </Stack>

        <Divider sx={{ mt: 2, mb: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          End of history.
        </Typography>
      </Paper>
    </Container>
  );
}
