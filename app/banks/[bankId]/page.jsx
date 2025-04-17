'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function BankDetails() {
  const { bankId } = useParams()
  const router = useRouter()

  const [accountNumber, setAccountNumber] = useState('')
  const [accountExists, setAccountExists] = useState(false)
  const [debitCard, setDebitCard] = useState('')
  const [message, setMessage] = useState('')

  // ✅ Using mockAccounts now
  const mockAccounts = {
    sbi: ['123456', '111111'],
    hdfc: ['222222'],
    icici: ['333333'],
    axis: ['444444']
  }

  const bankNames = {
    sbi: 'State Bank of India',
    hdfc: 'HDFC Bank',
    icici: 'ICICI Bank',
    axis: 'Axis Bank'
  }

  const bankName = bankNames[bankId] || 'Your Bank'

  const handleAccountSubmit = (e) => {
    e.preventDefault()

    // ✅ Check using mockAccounts
    if (mockAccounts[bankId]?.includes(accountNumber)) {
      setAccountExists(true)
      setMessage('')
    } else {
      setMessage('Account not found. Please try again.')
    }
  }

  // ✅ Updated handleCardSubmit with length check and redirect
  const handleCardSubmit = (e) => {
    e.preventDefault()

    if (debitCard.length === 16) {
      setMessage(`✅ Login successful for ${bankName}`)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      setMessage('Invalid debit card number.')
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{bankName}</h1>

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
          <button type="submit">Submit</button>
        </form>
      )}

      {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
    </main>
  )
}

