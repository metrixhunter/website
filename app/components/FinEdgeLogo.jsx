import Image from 'next/image';

export default function FinEdgeLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
      <img src="/finedge-logo.png" alt="FinEdge Logo" width={50} height={50} priority />
      <span style={{ fontWeight: 'bold', fontSize: '2rem' }}>Finedge 💸</span>
    </div>
  );
}

  