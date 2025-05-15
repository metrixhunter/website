'use client';

import Sidebar from '@/app/components/Sidebar';
import { usePathname } from 'next/navigation';
import './globals.css';

export default function Layout({ children }) {
  const pathname = usePathname();

  // Sidebar should only be visible on finance-related pages
  const allowedSidebarPages = ['/page', '/budgeting', '/saving', '/safety', '/credit', '/investment'];

  // Debugging Step - Check Current Path in Console
  console.log('Current Path:', pathname);

  // Show sidebar only on specified pages
  const showSidebar = allowedSidebarPages.includes(pathname);

  return (
    <html lang="en">
      <body className="app-container">
        {showSidebar && <Sidebar />}
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}



