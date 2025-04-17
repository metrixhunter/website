'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard/home')
    }, 3000) // redirect after 3 seconds

    return () => clearTimeout(timer)
  }, [router])

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Your Dashboard</h1>
      <p>You are now logged into your bank account on <strong>FinEdge</strong>.</p>
    </main>
  )
}

    