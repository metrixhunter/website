import Image from 'next/image';

export default function FinEdgeLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
    <img src="/logo.png" priority={String(true)} />
      <span style={{ fontWeight: 'bold', fontSize: '2rem' }}>Finedge 💸</span>
    </div>
  );
}

  