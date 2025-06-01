'use client';

import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import FooterFinancialNav from '@/app/components/FooterFinancialNav';

export default function SafetyPage() {
  return (
    <Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>🛡️ Financial Safety</Typography>
          <Typography paragraph>
            <b>What is Financial Safety?</b> Financial safety means protecting yourself and your money from risks like fraud, scams, and loss.
          </Typography>
          <Typography><b>How to Stay Safe:</b></Typography>
          <List>
            <ListItem><ListItemText primary="Use strong, unique passwords for your accounts" /></ListItem>
            <ListItem><ListItemText primary="Be alert for phishing emails and scams" /></ListItem>
            <ListItem><ListItemText primary="Monitor your accounts for suspicious activity" /></ListItem>
            <ListItem><ListItemText primary="Do not share sensitive information easily" /></ListItem>
          </List>
          <Typography sx={{ mt: 2 }}><b>Example:</b></Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
            <Typography>
              If you get an unexpected call asking for your bank password, it's likely a scam. Never share your credentials on calls or emails.
            </Typography>
          </Paper>
        </Paper>
      </Container>
      <FooterFinancialNav links={[
        { href: '/budgeting', label: '💰 Budgeting' },
        { href: '/saving', label: '🏦 Saving' },
        { href: '/investment', label: '📈 Investment' },
        { href: '/credit', label: '💳 Credit' }
      ]} />
    </Box>
  );
}
  
  