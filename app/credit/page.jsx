'use client';

import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import FooterFinancialNav from '@/app/components/FooterFinancialNav';

export default function CreditPage() {
  return (
    <Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>💳 Credit</Typography>
          <Typography paragraph>
            <b>What is Credit?</b> Credit is a contractual agreement in which a borrower receives something of value now and agrees to repay the lender at a later date—generally with interest. 
            It also refers to creditworthiness or credit history.
          </Typography>
          <Typography><b>Types of Credit:</b></Typography>
          <List>
            <ListItem><ListItemText primary="Personal Loans" /></ListItem>
            <ListItem><ListItemText primary="Credit Cards" /></ListItem>
            <ListItem><ListItemText primary="Home Loans" /></ListItem>
            <ListItem><ListItemText primary="Car Loans" /></ListItem>
          </List>
          <Typography sx={{ mt: 2 }}><b>Example:</b></Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
            <Typography>
              If you buy a phone for ₹20,000 on your credit card and repay it over 6 months, you may pay additional interest based on your card's terms.
            </Typography>
          </Paper>
        </Paper>
      </Container>
      <FooterFinancialNav links={[
        { href: '/budgeting', label: '💰 Budgeting' },
        { href: '/saving', label: '🏦 Saving' },
        { href: '/investment', label: '📈 Investment' },
        { href: '/safety', label: '🛡️ Safety' }
      ]} />
    </Box>
  );
}
  