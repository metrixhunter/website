// app/banks/bankUtils.js

export function selectOrOverrideBank(selectedBankId) {
  // Temporarily store the selected bank in localStorage before successful linking
  localStorage.setItem('selectedBank', selectedBankId);

  try {
    const storedRaw = sessionStorage.getItem('bankCredentials');
    if (storedRaw) {
      const creds = JSON.parse(storedRaw);

      // Override the stored bank with the newly selected bank if different
      if (!creds.bank || creds.bank !== selectedBankId) {
        creds.bank = selectedBankId;
        sessionStorage.setItem('bankCredentials', JSON.stringify(creds));
      }
    }
  } catch (e) {
    // Fail silently if parsing or storage fails
    console.error('Error updating bank credentials in sessionStorage', e);
  }
}
