// /components/ui/card.jsx
export function Card({ children, style }) {
    return (
      <div style={{ ...style, border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children }) {
    return <div>{children}</div>;
  }
  