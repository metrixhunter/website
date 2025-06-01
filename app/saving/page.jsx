'use client';

import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import FooterFinancialNav from '@/app/components/FooterFinancialNav';

export default function SavingPage() {
  return (
    <Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>🏦 Saving</Typography>
          <Typography paragraph>
            <b>What is Saving?</b> Saving is the act of setting aside a portion of your income for future use, rather than spending it immediately.
          </Typography>
          <Typography><b>Benefits of Saving:</b></Typography>
          <List>
            <ListItem><ListItemText primary="Provides security for emergencies" /></ListItem>
            <ListItem><ListItemText primary="Helps achieve big goals (buying a house, car, etc.)" /></ListItem>
            <ListItem><ListItemText primary="Reduces financial stress and anxiety" /></ListItem>
          </List>
          <Typography sx={{ mt: 2 }}><b>Example:</b></Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
            <Typography>
              If you save ₹2,000 every month, after one year you'll have ₹24,000—enough for a vacation, an emergency fund, or the start of an investment.
            </Typography>
          </Paper>
        </Paper>
      </Container>
      <FooterFinancialNav links={[
        { href: '/budgeting', label: '💰 Budgeting' },
        { href: '/investment', label: '📈 Investment' },
        { href: '/credit', label: '💳 Credit' },
        { href: '/safety', label: '🛡️ Safety' }
      ]} />
    </Box>
  );
}

