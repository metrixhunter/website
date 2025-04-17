'use client'

import Sidebar from './sidebar'
import { usePathname } from 'next/navigation'
import './globals.css'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const hideSidebar = pathname === '/login' || pathname === '/signup'

  return (
    <html lang="en">
      <body style={{ display: 'flex' }}>
        {!hideSidebar && <Sidebar />}
        <main style={{ flex: 1 }}>{children}</main>
      </body>
    </html>
  )
}
