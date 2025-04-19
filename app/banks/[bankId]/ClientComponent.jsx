'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientComponent({ bankId }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [debitCard, setDebitCard] = useState('');
  const [accountExists, setAccountExists] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter(); // Added for navigation

  const mockAccounts = {
    sbi: ['123456', '111111'],
    hdfc: ['222222'],
    icici: ['333333'],
    axis: ['444444'],
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();

    // Check if the account number exists for the specific bank
    if (mockAccounts[bankId]?.includes(accountNumber)) {
      setAccountExists(true);
      setMessage('Account verified! Please proceed to enter your debit card.');
    } else {
      setMessage('Account not found. Please try again.');
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();

    // Check if debit card number is 16 digits long
    if (debitCard.length === 16) {
      setMessage('✅ Debit card verified successfully!');
      setTimeout(() => {
        router.push('/dashboard'); // Redirects to the dashboard
      }, 2000);
    } else {
      setMessage('Invalid debit card number. Please try again.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      {!accountExists ? (
        <form onSubmit={handleAccountSubmit}>
          <label>Enter Account Number:</label><br />
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            style={{ padding: '0.5rem', margin: '0.5rem 0' }}
          /><br />
          <button type="submit">Check Account</button>
        </form>
      ) : (
        <form onSubmit={handleCardSubmit}>
          <label>Enter Debit Card Number:</label><br />
          <input
            type="text"
            value={debitCard}
            onChange={(e) => setDebitCard(e.target.value)}
            style={{ padding: '0.5rem', margin: '0.5rem 0' }}
          /><br />
          <button type="submit">Verify Debit Card</button>
        </form>
      )}

      {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
    </div>
  );
}


