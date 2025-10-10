'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from '@mui/material';

export default function ElectricityBillPage() {
  const [meterNumber, setMeterNumber] = useState('');
  const [units, setUnits] = useState('');
  const [region, setRegion] = useState('');
  const [bill, setBill] = useState(null);
  const [billHistory, setBillHistory] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const bankOptions = [
    { label: 'SBI Bank', value: 'SBI' },
    { label: 'Axis Bank', value: 'AXIS' },
    { label: 'HDFC Bank', value: 'HDFC' },
    { label: 'ICICI Bank', value: 'ICICI' },
    { label: 'FinEdge Wallet (UPI)', value: 'UPI' },
  ];

  // Load bill history
  useEffect(() => {
    const stored = localStorage.getItem('billHistory');
    if (stored) setBillHistory(JSON.parse(stored));
  }, []);

  const saveHistory = (newHistory) => {
    localStorage.setItem('billHistory', JSON.stringify(newHistory));
    setBillHistory(newHistory);
  };

  // Calculate bill logic
  const calculateBill = () => {
    const u = parseFloat(units);
    if (!meterNumber.trim() || !u || !region.trim()) {
      alert('Please fill all fields correctly.');
      return;
    }

    let cost = 0;

    if (u <= 100) cost = u * 3.5;
    else if (u <= 300) cost = 100 * 3.5 + (u - 100) * 5.5;
    else cost = 100 * 3.5 + 200 * 5.5 + (u - 300) * 7;

    const fixedCharge = 80;
    const total = cost + fixedCharge;

    const newBill = {
      meterNumber,
      region,
      units: u,
      total: total.toFixed(2),
      date: new Date().toLocaleDateString(),
      paid: false,
      paymentMethod: null,
    };

    setBill(newBill);
  };

  // Handle payment
  const handlePayment = () => {
    if (!bill) {
      alert('Please calculate your bill first.');
      return;
    }
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    const updatedBill = { ...bill, paid: true, paymentMethod };
    const updatedHistory = [updatedBill, ...billHistory];
    saveHistory(updatedHistory);
    setPaymentDone(true);
    setOpenSnackbar(true);
    setBill(updatedBill);
  };

  const clearHistory = () => {
    localStorage.removeItem('billHistory');
    setBillHistory([]);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}
    >
      <Paper elevation={4} sx={{ p: 4, borderRadius: '16px', width: '100%' }}>
        <Typography variant="h5" align="center" gutterBottom>
          ⚡ Electricity Bill 
        </Typography>

        <TextField
          fullWidth
          label="Meter Number"
          value={meterNumber}
          onChange={(e) => setMeterNumber(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Units Consumed (kWh)"
          type="number"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Region / City"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          margin="normal"
        />

        <Box textAlign="center" mt={2}>
          <Button variant="contained" color="primary" onClick={calculateBill}>
            Calculate Bill
          </Button>
        </Box>

        {bill && (
          <Box mt={3} textAlign="center">
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" color="success.main">
              Estimated Bill: ₹{bill.total}
            </Typography>
            <Typography variant="body2">
              ({bill.units} units • {bill.region})
            </Typography>

            {/* ✅ Payment Section */}
            {!bill.paid ? (
              <Box mt={3}>
                <FormControl fullWidth>
                  <InputLabel id="payment-method-label">
                    Select Payment Method
                  </InputLabel>
                  <Select
                    labelId="payment-method-label"
                    value={paymentMethod}
                    label="Payment Method"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {bankOptions.map((bank) => (
                      <MenuItem key={bank.value} value={bank.value}>
                        {bank.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2 }}
                  onClick={handlePayment}
                >
                  Pay ₹{bill.total}
                </Button>
              </Box>
            ) : (
              <Typography variant="h6" sx={{ mt: 2 }} color="primary">
                ✅ Paid via {bill.paymentMethod}
              </Typography>
            )}
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          📜 Bill History
        </Typography>
        {billHistory.length === 0 ? (
          <Typography color="text.secondary">No previous bills.</Typography>
        ) : (
          <>
            <List>
              {billHistory.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`₹${item.total} — ${item.region}`}
                    secondary={`${
                      item.units
                    } units • ${item.date} • ${item.paid ? `✅ Paid (${item.paymentMethod})` : '❌ Unpaid'}`}
                  />
                </ListItem>
              ))}
            </List>
            <Box textAlign="center" mt={2}>
              <Button variant="outlined" color="error" onClick={clearHistory}>
                Clear History
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={paymentDone ? 'success' : 'info'}>
          {paymentDone
            ? '✅ Payment successful!'
            : 'Bill calculated successfully!'}
        </Alert>
      </Snackbar>
    </Container>
  );
}'use client';

