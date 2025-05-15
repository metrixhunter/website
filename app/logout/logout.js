export const logout = () => {
  // Clear localStorage data
  localStorage.removeItem('user');
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('authToken');

  // Clear sessionStorage
  sessionStorage.clear();

  // Clear all cookies properly
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/");
  });

  // Redirect to the homepage after logout
  window.location.href = "/";
};






  

  
  
  