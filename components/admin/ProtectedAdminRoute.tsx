'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!loading) {
        if (!user) {
          // Redirect to login if not authenticated
          router.push('/auth/login?redirect=/admin');
          return;
        }

        // Check if user has admin role
        // For now, we'll check if user email contains 'admin' or has admin property
        // This should be replaced with proper role checking from backend
        const isAdmin = user.email?.includes('admin') || 
                       (user as any).role === 'admin' || 
                       (user as any).isAdmin === true;

        if (!isAdmin) {
          // Redirect to main dashboard if not admin
          router.push('/dashboard');
          return;
        }

        setIsChecking(false);
      }
    };

    checkAdminAccess();
  }, [user, loading, router]);

  // Show loading spinner while checking authentication and authorization
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-300">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // If we reach here, user is authenticated and has admin access
  return <>{children}</>;
};

export default ProtectedAdminRoute;