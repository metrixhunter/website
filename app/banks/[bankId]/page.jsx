import ClientComponent from './ClientComponent';

export function generateStaticParams() {
  const bankIds = ['sbi', 'hdfc', 'icici', 'axis']; // Replace with actual bank IDs
  return bankIds.map((bankId) => ({ bankId }));
}

export default function BankDetails({ params }) {
  const bankId = params.bankId;

  const bankNames = {
    sbi: 'State Bank of India',
    hdfc: 'HDFC Bank',
    icici: 'ICICI Bank',
    axis: 'Axis Bank',
  };

  const bankName = bankNames[bankId] || 'Your Bank';

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{bankName}</h1>
      <p>Welcome to {bankName}'s page. Customize this content!</p>
      <ClientComponent bankId={bankId} />
    </main>
  );
}




