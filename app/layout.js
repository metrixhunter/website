'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button, Container, Typography } from '@mui/material';
import './globals.css';

export default function Layout({ children }) {
  const pathname = usePathname();
  const [showFinanceButtons, setShowFinanceButtons] = useState(false);

  // ✅ List of pages where financial buttons should be visible
  const financialPages = ['/', '/budgeting', '/saving', '/credit', '/investment', '/safety'];

  return (
    <html lang="en">
      <body className="app-container">
        <div style={{ display: 'flex', minHeight: '100vh' }}>

          {/* 🔹 Show only on financial pages */}
          {financialPages.includes(pathname) && (
            <>
              {/* Three-Line Toggle Button */}
              <button
                onClick={() => setShowFinanceButtons((prev) => !prev)}
                style={{
                  position: 'absolute', top: '20px', left: showFinanceButtons ? '210px' : '10px',
                  padding: '10px', backgroundColor: '#333', color: '#fff',
                  border: 'none', borderRadius: '5px', cursor: 'pointer',
                  fontSize: '24px', transition: 'left 0.3s ease-in-out'
                }}
              >
                {showFinanceButtons ? '⬅' : '☰'}
              </button>

              {/* Financial Navigation Buttons (Left Corner) */}
              {showFinanceButtons && (
                <div style={{
                  position: 'absolute', top: '60px', left: '10px',
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                  width: '200px', padding: '1rem', border: '1px solid #ddd',
                  backgroundColor: '#f9f9f9', borderRadius: '10px'
                }}>
                  <h3>Finance Tools</h3>
                  <Link href="/">
                    <button style={{
                      padding: '10px', width: '100%', backgroundColor: '#222', color: 'white', borderRadius: '5px'
                    }}>
                      🏠 Go to Main Page
                    </button>
                  </Link>
                  <Link href="/budgeting">
                    <button style={{
                      padding: '10px', width: '100%', backgroundColor: '#004A99', color: 'white', borderRadius: '5px'
                    }}>
                      💰 Budgeting
                    </button>
                  </Link>
                  <Link href="/saving">
                    <button style={{
                      padding: '10px', width: '100%', backgroundColor: '#007B5E', color: 'white', borderRadius: '5px'
                    }}>
                      🏦 Saving
                    </button>
                  </Link>
                  <Link href="/credit">
                    <button style={{
                      padding: '10px', width: '100%', backgroundColor: '#D32F2F', color: 'white', borderRadius: '5px'
                    }}>
                      💳 Credit
                    </button>
                  </Link>
                  <Link href="/investment">
                    <button style={{
                      padding: '10px', width: '100%', backgroundColor: '#388E3C', color: 'white', borderRadius: '5px'
                    }}>
                      📈 Investment
                    </button>
                  </Link>
                  <Link href="/safety">
                    <button style={{
                      padding: '10px', width: '100%', backgroundColor: '#F57C00', color: 'white', borderRadius: '5px'
                    }}>
                      🔒 Financial Safety
                    </button>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* 🔹 Main Content (Login/Signup only on `/`) */}
          <main className="main-content" style={{ flexGrow: 1, padding: '2rem' }}>
            {pathname === '/' ? (
              <Container maxWidth="md" style={{ textAlign: 'center', padding: '2rem' }}>
                <Typography variant="h4"> 💸 Welcome to FinEdge</Typography>
                <Typography variant="body1">
                  Securely manage your finances. Log in or sign up to get started.
                </Typography>

                {/* Redirect Notification */}
                <Typography variant="h6" style={{ marginTop: '1rem' }}></Typography>
                <p> <a href="/"></a>.</p>

                {/* Button Group */}
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button variant="contained" color="primary" href="/login">🔑 Login</Button>
                  <Button variant="contained" color="secondary" href="/signup">📝 Signup</Button>
                </div>
              </Container>
            ) : children} {/* ✅ Shows login/signup section only on `/` */}
          </main>
        </div>
      </body>
    </html>
  );
}















