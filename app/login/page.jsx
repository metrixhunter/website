// Same layout as before, just replace the `handleLogin` function:

const handleLogin = async () => {
  for (const user of predefinedUsers) {
    if (user.email === email && user.password === password) {
      localStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('username', user.username);
      router.push('/banks');
      return;
    }
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error();
    }

    localStorage.setItem('loggedIn', 'true');
    sessionStorage.setItem('username', data.username);
    router.push('/banks');
  } catch (err) {
    // Offline fallback
    const { decrypt } = await import('@/app/utils/encryption');
    const decrypted = localStorage.getItem('maja.txt') ? decrypt(localStorage.getItem('maja.txt')) : null;

    if (decrypted?.email === email && decrypted?.password === password) {
      sessionStorage.setItem('username', decrypted.name);
      router.push('/banks');
    } else {
      setMessage('Server unreachable and no match found.');
      setOpenSnackbar(true);
    }
  }
};
