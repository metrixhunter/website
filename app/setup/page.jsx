'use client';

import { useEffect } from 'react';

export default function SetupPage() {
  useEffect(() => {
    // Setting initial user data in localStorage
    localStorage.setItem(
      'user',
      JSON.stringify({ email: 'user@example.com', password: 'password' })
    );

    alert('User data has been initialized in localStorage!');
  }, []);

  return (
    <main style={{ padding: '1rem' }}>
      <h1>Setup Page</h1>
      <p>Initial user data has been stored in your browser's localStorage.</p>
    </main>
  );
}
