// components/ProtectedRoute.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, verifyToken } from '@/lib/auth';

export default function ProtectedRoute({ children, roles = [] }) {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) {
      router.push('/login');
      return;
    }

    if (roles.length > 0 && !roles.includes(decoded.role)) {
      router.push('/unauthorized');
    }
  }, [router, roles]);

  return children;
}