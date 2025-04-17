'use client';

import { useState } from 'react';

export default function ClientComponent({ bankId }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountNumber === '123456') {
      setMessage('Account verified!');
    } else {
      setMessage('Account not found.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter Account Number:</label><br />
      <input
        type="text"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      /><br />
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
}
