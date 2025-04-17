'use client'

import Link from 'next/link'
import FinEdgeLogo from '@/app/components/FinEdgeLogo'

export default function Home() {
  return (
    <div style={{ padding: '1rem' }}>
      <FinEdgeLogo />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
        <Link href="/login">
          <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Login</button>
        </Link>
        <Link href="/signup">
          <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Sign Up</button>
        </Link>
      </div>

      <h1>Welcome to 
      Finedge</h1>
      <p>Select an option from the sidebar for mastering basic financial skills.</p>
    </div>
  )
}


