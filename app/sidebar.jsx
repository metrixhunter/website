import Link from 'next/link'

const links = [
  { href: '/budgeting', label: '💰 Budgeting' },
  { href: '/saving', label: '🏦 Saving' },
  { href: '/credit', label: '💳 Credit' },
  { href: '/investment', label: '📈 Investment' },
  { href: '/safety', label: '🔒 Financial Safety' },
]

export default function Sidebar() {
  return (
    <aside style={{ width: '250px', padding: '1rem', borderRight: '1px solid #ddd' }}>
      <h2>Finedge</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {links.map(link => (
            <li key={link.href} style={{ margin: '0.5rem 0' }}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}


