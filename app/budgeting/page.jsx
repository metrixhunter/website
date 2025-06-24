'use client';

import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';


export default function BudgetingPage() {
  return (
    <Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>💰 Budgeting</Typography>
          <Typography paragraph>
            <b>What is Budgeting?</b> Budgeting is the process of creating a plan to manage your income and expenses over a specific period of time. 
            It helps you prioritize spending, track your habits, and save for both short- and long-term goals.
          </Typography>
          <Typography><b>Why Budget?</b></Typography>
          <List>
            <ListItem><ListItemText primary="Avoid unnecessary debt and overspending" /></ListItem>
            <ListItem><ListItemText primary="Build an emergency fund for unexpected expenses" /></ListItem>
            <ListItem><ListItemText primary="Achieve financial goals efficiently" /></ListItem>
            <ListItem><ListItemText primary="Gain control and confidence over your finances" /></ListItem>
          </List>
          <Typography sx={{ mt: 2 }}><b>Example:</b></Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
            <Typography>
              Suppose your monthly income is ₹30,000 and your monthly expenses are ₹22,000. If you budget, you can set aside the remaining ₹8,000 for savings or investment, and plan for emergencies.
            </Typography>
          </Paper>
        </Paper>
      </Container>
      
    </Box>
  );
}








  
  