import { useRouter } from 'next/router';
import useAuth from '@common/hooks/useAuth';
import usePermissions from '@common/hooks/usePermissions';
import permissions from '@common/defs/types/permissions';
import { ReactNode, useEffect, useMemo } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, initialized } = useAuth();
  const router = useRouter();
  const { isAdmin, isManager, isUser } = usePermissions();

  // Déterminer les routes accessibles en fonction du rôle de l'utilisateur
  const accessibleRoutes = useMemo(() => {
    if (isAdmin) {
      return permissions.admin.items.flatMap((item) =>
        item.itemLink ? [item.itemLink] : item.sousItems?.map((sub) => sub.itemLink) || [],
      );
    }
    if (isManager) {
      return permissions.manager.items.flatMap((item) =>
        item.itemLink ? [item.itemLink] : item.sousItems?.map((sub) => sub.itemLink) || [],
      );
    }
    if (isUser) {
      return permissions.user.items.flatMap((item) =>
        item.itemLink ? [item.itemLink] : item.sousItems?.map((sub) => sub.itemLink) || [],
      );
    }
    return [];
  }, [isAdmin, isManager, isUser]);

  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
    } else if (initialized && user && !accessibleRoutes.includes(router.pathname)) {
      router.push('/404'); // Rediriger vers une page d'erreur si l'utilisateur n'a pas accès
    }
  }, [initialized, user, router, accessibleRoutes]);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!user || !accessibleRoutes.includes(router.pathname)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
