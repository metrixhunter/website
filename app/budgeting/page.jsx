'use client';

import { useState } from 'react';

import { Container, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Alert } from '@mui/material';

export default function BudgetingPage() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
const [savings, setSavings] = useState(null);
  const [message, setMessage] = useState('');

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

  return (
    <div style={{ display: 'flex' }}>
      

      <Container maxWidth="md" style={{ padding: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>💰 Budgeting</Typography>
          <Typography variant="body1">Master your finances with smart budgeting strategies.</Typography>

          <List>
            {["Track your monthly income", "List your fixed and variable expenses", "Set savings goals", "Review your budget monthly"].map((item) => (
              <ListItem key={item}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" style={{ marginTop: '1rem' }}>Calculate Your Budget:</Typography>

          <TextField label="Monthly Income" type="number" fullWidth margin="normal" value={income} onChange={(e) => setIncome(e.target.value)} />
          <TextField label="Monthly Expenses" type="number" fullWidth margin="normal" value={expenses} onChange={(e) => setExpenses(e.target.value)} />

          <Button variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }} onClick={handleCalculate}>Calculate Savings</Button>

          {message && <Alert severity={savings >= 0 ? 'success' : 'warning'} style={{ marginTop: '1rem' }}>{message}</Alert>}

          {savings !== null && <Typography variant="h6" style={{ marginTop: '1rem' }}>Remaining Savings: ₹{savings}</Typography>}

          {/* ✅ Added Budgeting Navigation Button */}
          <Button variant="contained" color="secondary" fullWidth style={{ marginTop: '1.5rem' }} href="/budgeting">
            📊 Learn More About Budgeting
          </Button>
        </Paper>
      </Container>
    </div>
  );
}






  
  