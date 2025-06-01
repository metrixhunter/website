'use client';

import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import FooterFinancialNav from '@/app/components/FooterFinancialNav';

export default function InvestmentPage() {
  return (
    <Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>📈 Investment</Typography>
          <Typography paragraph>
            <b>What is Investment?</b> Investment is the process of allocating your money into assets (like stocks, bonds, real estate) with the expectation of earning a return or profit.
          </Typography>
          <Typography><b>Why Invest?</b></Typography>
          <List>
            <ListItem><ListItemText primary="Grow your wealth over time" /></ListItem>
            <ListItem><ListItemText primary="Beat inflation" /></ListItem>
            <ListItem><ListItemText primary="Achieve financial independence" /></ListItem>
          </List>
          <Typography sx={{ mt: 2 }}><b>Example:</b></Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
            <Typography>
              Investing ₹10,000 in a mutual fund that grows at 10% per year could be worth more than ₹25,000 in 10 years.
            </Typography>
          </Paper>
        </Paper>
      </Container>
      <FooterFinancialNav links={[
        { href: '/budgeting', label: '💰 Budgeting' },
        { href: '/saving', label: '🏦 Saving' },
        { href: '/credit', label: '💳 Credit' },
        { href: '/safety', label: '🛡️ Safety' }
      ]} />
    </Box>
  );
}
  
  