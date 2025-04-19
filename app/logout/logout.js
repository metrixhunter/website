const logout = () => {
  // Clear localStorage data
  localStorage.removeItem('user');

  // If sessionStorage or cookies are involved, clear them as well
  sessionStorage.clear(); // Example for clearing sessionStorage
  document.cookie = ''; // Example for clearing cookies (if used)
};

export default logout;





  

  
  
  