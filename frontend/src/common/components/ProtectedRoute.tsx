import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import { ReactNode, useEffect } from 'react';
import { User, ROLE } from '@common/defs/types/user';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: ROLE[];
  requiredPermissions?: { entity: string; action: string }[];
}

const ProtectedRoute = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
}: ProtectedRouteProps) => {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && (!user || !hasRequiredAccess(user, requiredRoles, requiredPermissions))) {
      router.push('/login');
    }
  }, [initialized, user]);

  if (!initialized || !user || !hasRequiredAccess(user, requiredRoles, requiredPermissions)) {
    return null;
  }

  return <>{children}</>;
};

const hasRequiredAccess = (
  user: User,
  roles: ROLE[],
  permissions: { entity: string; action: string }[],
) => {
  const hasRole = roles.length === 0 || roles.some((role) => user.role?.includes(role));
  const hasPermission =
    permissions.length === 0 ||
    permissions.every((permission) =>
      user.Permissions?.some(
        (userPermission) =>
          userPermission.entity === permission.entity &&
          userPermission.action === permission.action,
      ),
    );

  return hasRole && hasPermission;
};

export default ProtectedRoute;
