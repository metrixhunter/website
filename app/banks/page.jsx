'use client'

import { useRouter } from 'next/navigation'

const banks = [
  { name: 'State Bank of India', id: 'sbi' },
  { name: 'HDFC Bank', id: 'hdfc' },
  { name: 'ICICI Bank', id: 'icici' },
  { name: 'Axis Bank', id: 'axis' }
]

export default function BanksPage() {
  const router = useRouter()

  const handleBankClick = (id) => {
    // Redirect to the bank details page
    router.push(`/banks/${id}`)
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Select Your Bank</h1>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {banks.map((bank) => (
          <div 
            key={bank.id} 
            onClick={() => handleBankClick(bank.id)}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              width: '200px',
              textAlign: 'center'
            }}>
            {bank.name}
          </div>
        ))}
      </div>
    </main>
  )
}


