'use client';
import { useEffect } from 'react';
import SignupPage from './page';

export default function SignupWrapper() {
  useEffect(() => {
    // Store original handleSignup
    const originalHandleSignup = SignupPage.prototype.handleSignup;
    
    // Modify the prototype
    SignupPage.prototype.handleSignup = async function() {
      // Get current form values
      const { name, email, password } = this.state;
      
      try {
        // First save to files via API
        await fetch('/api/save-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
      } catch (error) {
        console.error('Failed to save user data:', error);
      }
      
      // Then call original handler
      return originalHandleSignup.apply(this);
    };

    return () => {
      // Clean up - restore original
      SignupPage.prototype.handleSignup = originalHandleSignup;
    };
  }, []);

  return <SignupPage />;
}