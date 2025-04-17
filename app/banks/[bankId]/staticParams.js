export function generateStaticParams() {
    const bankIds = ['sbi', 'hdfc', 'icici', 'axis'];
  
    return bankIds.map((bankId) => ({
      bankId,
    }));
  }
  