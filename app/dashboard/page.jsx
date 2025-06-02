'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { logout } from '@/app/logout/logout';
import Link from 'next/link';

import FeatureButton from '@/app/components/FeatureButton';

import {
  AccountBalance,
  Send,
  AddCircle,
  Receipt,
  FlashOn,
  Flight,
  Hotel,
  Money,
  Tv,
  History as HistoryIcon,
  AccountBalanceWallet as BalanceIcon,
} from '@mui/icons-material';

// List of supported banks (lowercase for easy matching)
const supportedBanks = [
  { value: 'icici', label: 'ICICI Bank' },
  { value: 'sbi', label: 'State Bank of India (SBI)' },
  { value: 'axis', label: 'Axis Bank' },
  { value: 'hdfc', label: 'HDFC Bank' },
];

// Demo actions
const actions = [
  { label: 'UPI Money Transfer', icon: <Send />, href: '/upi' },
  { label: 'Passbook', icon: <AccountBalance />, href: '/passbook' },
  { label: 'Add Money', icon: <AddCircle />, href: '/add-money' },
  { label: 'Recharge', icon: <Receipt />, href: '/recharge' },
  { label: 'Electricity', icon: <FlashOn />, href: '/electricity' },
  { label: 'Travel', icon: <Flight />, href: '/travel' },
  { label: 'Hotel', icon: <Hotel />, href: '/hotel' },
  { label: 'Send Money', icon: <Money />, href: '/send-money' },
  { label: 'Bank Transfer', icon: <AccountBalance />, href: '/bank-transfer' },
  { label: 'DTH Recharge', icon: <Tv />, href: '/dth' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [hasBankInfo, setHasBankInfo] = useState(false);

  // For demo: balance and history (normally from API)
  const [selectedBank, setSelectedBank] = useState('');
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Retrieve user info (from sessionStorage)
    const username = sessionStorage.getItem('username');
    const phone = sessionStorage.getItem('phone');
    const countryCode = sessionStorage.getItem('countryCode');
    const bank = sessionStorage.getItem('bank');
    const accountNumber = sessionStorage.getItem('accountNumber');
    const debitCardNumber = sessionStorage.getItem('debitCardNumber');

    if (!username || !phone || !countryCode) {
      router.replace('/login');
      return;
    }

    setUser({ username, phone, countryCode, bank, accountNumber, debitCardNumber });

    if (bank && accountNumber && debitCardNumber) {
      setHasBankInfo(true);
      setSelectedBank(bank.toLowerCase());
    }
  }, [router]);

  // Demo: When a supported bank is selected, show dummy balance/history
  useEffect(() => {
    if (supportedBanks.find(b => b.value === selectedBank)) {
      // Show fake balance and history
      setBalance({
        amount: '₹ 23,540.50',
        bank: selectedBank,
        account: user?.accountNumber || 'xxxxxx1234',
      });
      setHistory([
        { date: '2025-06-01', desc: 'UPI Receive', amount: '+₹2,500.00', type: 'credit' },
        { date: '2025-05-30', desc: 'Electricity Bill', amount: '-₹1,200.00', type: 'debit' },
        { date: '2025-05-29', desc: 'Mobile Recharge', amount: '-₹149.00', type: 'debit' },
        { date: '2025-05-28', desc: 'Salary', amount: '+₹30,000.00', type: 'credit' },
        { date: '2025-05-25', desc: 'DTH Recharge', amount: '-₹399.00', type: 'debit' },
      ]);
    } else {
      setBalance(null);
      setHistory([]);
    }
  }, [selectedBank, user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Bank/account setup for first time users OR redirect to bank verification page
  const handleGenerateBank = () => {
    router.push('/banks');
  };

  // If user chooses a bank from dropdown, redirect to that bank page (Paytm-style behavior)
  const handleBankSelect = (e) => {
    const bankVal = e.target.value;
    setSelectedBank(bankVal);
    // Redirect to the particular bank page for verification
    router.push(`/banks/${bankVal}`);
  };

  // Main desktop layout (Paytm-style)
  return (
    <Container maxWidth="xl" sx={{ padding: '2rem', display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '220px',
            padding: '1rem',
            border: '1px solid #ddd',
            backgroundColor: '#f9f9f9',
            borderRadius: '0 10px 10px 0',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <Link href="/dashboard" passHref>
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#004A99',
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'none'
              }}
              onClick={() => router.push('/dashboard/home')}
            >
              🏠 Return to Home
            </Button>
          </Link>

          {actions.map((action, idx) => (
            <Button
              key={idx}
              fullWidth
              variant="outlined"
              sx={{
                padding: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'none',
                borderColor: 'transparent',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => router.push(action.href)}
              startIcon={action.icon}
            >
              {action.label}
            </Button>
          ))}
        </Paper>
      )}

      {/* Toggle Sidebar Button */}
      <IconButton
        onClick={() => setSidebarOpen(!sidebarOpen)}
        sx={{
          position: 'fixed',
          top: 20,
          left: sidebarOpen ? 230 : 20,
          zIndex: 1000,
          backgroundColor: '#fff',
          border: '1px solid #ddd'
        }}
      >
        {sidebarOpen ? <ArrowBackIcon /> : <MenuIcon />}
      </IconButton>

      {/* Main Content */}
      <Box
        sx={{
          marginLeft: sidebarOpen ? '260px' : '60px',
          width: '100%',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>Dashboard</Typography>
        {user && (
          <>
            <Typography variant="body1">Welcome, {user.username}!</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Phone: {user.countryCode} {user.phone}
            </Typography>
          </>
        )}

        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 1, mb: 2 }}
          onClick={handleLogout}
        >
          Logout
        </Button>

        <Divider sx={{ my: 2 }} />

        {/* Bank/account info setup or summary */}
        {!hasBankInfo ? (
          <Box>
            <Typography sx={{ mt: 2 }}>
              Please select/set up your bank, account number, and debit card number to continue.
            </Typography>
            <FormControl fullWidth sx={{ mt: 3, maxWidth: 300 }}>
              <InputLabel id="dashboard-bank-select-label">Select Bank</InputLabel>
              <Select
                labelId="dashboard-bank-select-label"
                value=""
                label="Select Bank"
                onChange={handleBankSelect}
              >
                {supportedBanks.map((b) => (
                  <MenuItem value={b.value} key={b.value}>{b.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ mt: 2, color: '#888' }}>
              You will be redirected to verify your details.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleGenerateBank}
            >
              Show All Banks
            </Button>
          </Box>
        ) : (
          <Box>
            {/* Show bank selection and balance/history */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                  <BalanceIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Balance & History
                  </Typography>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="bank-select-label">Select Bank</InputLabel>
                    <Select
                      labelId="bank-select-label"
                      value={selectedBank}
                      label="Select Bank"
                      onChange={e => setSelectedBank(e.target.value)}
                    >
                      {supportedBanks.map((b) => (
                        <MenuItem value={b.value} key={b.value}>{b.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {balance && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">
                        {supportedBanks.find(b => b.value === selectedBank)?.label || selectedBank}
                      </Typography>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                        {balance.amount}
                      </Typography>
                      <Typography variant="body2">
                        Account: {balance.account}
                      </Typography>
                    </Box>
                  )}
                </Paper>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <HistoryIcon sx={{ fontSize: 30, color: '#1976d2' }} />
                  <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>History</Typography>
                  <List dense sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    {history.length === 0 && (
                      <ListItem>
                        <ListItemText primary="No history found for this bank." />
                      </ListItem>
                    )}
                    {history.map((item, idx) => (
                      <ListItem key={idx} divider>
                        <ListItemText
                          primary={item.desc}
                          secondary={`${item.date} | ${item.amount}`}
                          primaryTypographyProps={{
                            color: item.type === 'credit' ? 'green' : 'red',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={8}>
                {/* Main actions grid */}
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Money Transfer & Services
                  </Typography>
                  <Grid container spacing={2}>
                    {actions.map((action, idx) => (
                      <Grid item xs={6} sm={4} md={3} key={idx}>
                        <FeatureButton icon={action.icon} label={action.label} href={action.href} />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
}



    