'use client';

import { useRef, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  Box,
  Divider,
  Link
} from '@mui/material';

export default function BudgetingPage() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [savings, setSavings] = useState(null);
  const [message, setMessage] = useState('');
  const [showLearnMore, setShowLearnMore] = useState(false);
  const learnMoreRef = useRef(null);

  const handleCalculate = () => {
    if (!income || !expenses || isNaN(income) || isNaN(expenses)) {
      setMessage('❌ Please enter valid numeric values.');
      setSavings(0);
      return;
    }

    const calculatedSavings = parseFloat(income) - parseFloat(expenses);
    setSavings(calculatedSavings);
    setMessage(calculatedSavings >= 0 ? '✅ You have savings left!' : '⚠️ You are overspending!');
  };

  const handleScrollToLearnMore = () => {
    setShowLearnMore(true);
    setTimeout(() => {
      learnMoreRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Delay so the content renders before scrolling
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="md" style={{ padding: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>💰 Budgeting</Typography>
          <Typography variant="body1">Master your finances with smart budgeting strategies.</Typography>

          <List>
            {[
              "Track your monthly income",
              "List your fixed and variable expenses",
              "Set savings goals",
              "Review your budget monthly"
            ].map((item) => (
              <ListItem key={item}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" style={{ marginTop: '1rem' }}>Calculate Your Budget:</Typography>

          <TextField label="Monthly Income" type="number" fullWidth margin="normal" value={income} onChange={(e) => setIncome(e.target.value)} />
          <TextField label="Monthly Expenses" type="number" fullWidth margin="normal" value={expenses} onChange={(e) => setExpenses(e.target.value)} />

          <Button variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }} onClick={handleCalculate}>
            Calculate Savings
          </Button>

          {message && (
            <Alert severity={savings >= 0 ? 'success' : 'warning'} style={{ marginTop: '1rem' }}>
              {message}
            </Alert>
          )}

          {savings !== null && (
            <Typography variant="h6" style={{ marginTop: '1rem' }}>
              Remaining Savings: ₹{savings}
            </Typography>
          )}

          <Button variant="contained" color="secondary" fullWidth style={{ marginTop: '1.5rem' }} onClick={handleScrollToLearnMore}>
            📊 Learn More About Budgeting
          </Button>
        </Paper>
      </Container>

      {/* ✅ Show this section only when button is clicked */}
      {showLearnMore && (
        <Container ref={learnMoreRef} maxWidth="md" style={{ padding: '2rem', marginTop: '1rem' }}>
          <Paper elevation={2} style={{ padding: '2rem' }}>
            <Typography variant="h5" gutterBottom>What is Budgeting?</Typography>
            <Typography variant="body1" style={{ lineHeight: '1.7' }}>
              Budgeting is the process of creating a plan to manage your income and expenses over a specific period of time.
              It allows you to prioritize how you spend your money, track your financial habits, and ensure that you're saving
              enough for both short-term and long-term goals. A well-prepared budget can help avoid unnecessary debt, build
              an emergency fund, and increase your sense of control over your finances. It includes identifying all sources
              of income, categorizing expenses (like rent, groceries, bills, and entertainment), and planning how much to
              allocate to savings or investments. Budgeting isn't just for those in financial trouble—it's a valuable habit
              for anyone who wants to achieve financial security and independence.
            </Typography>
          </Paper>
        </Container>
      )}

      {/* 🔻 Footer-style Section */}
      <Box style={{ backgroundColor: '#f5f5f5', padding: '2rem', marginTop: '2rem' }}>
        <Container maxWidth="md">
          <Typography variant="h6" style={{ marginBottom: '1rem', fontWeight: 'bold' }}>🔎 Search For</Typography>
          <Divider style={{ marginBottom: '1rem' }} />
          <Box display="flex" flexWrap="wrap" justifyContent="space-between">
            <Link href="/investment" underline="hover">💹 Investment</Link>
            <Link href="/safety" underline="hover">🛡️ Safety</Link>
            <Link href="/savings" underline="hover">🏦 Savings</Link>
            <Link href="/credit" underline="hover">💳 Credit</Link>
          </Box>
        </Container>
      </Box>
    </div>
  );
}









  
  