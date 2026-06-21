// components/layout/ConditionalLayout.jsx
'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '@/components/auth/AuthModal';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <AuthModal />
    </>
  );
}