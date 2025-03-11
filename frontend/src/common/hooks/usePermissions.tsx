import useAuth from '@common/hooks/useAuth';

const usePermissions = () => {
  const { user } = useAuth();

  const isAdmin = user?.role_id === 1;
  const isManager = user?.role_id === 2;
  const isUser = user?.role_id === 3;

  return { isAdmin, isManager, isUser };
};

export default usePermissions;
