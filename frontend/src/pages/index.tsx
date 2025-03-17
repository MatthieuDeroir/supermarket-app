import { NextPage } from 'next';
import Home from '@modules/home/Dashboard';
import UserDashboard from '@modules/home/UserDashboard';

import { Box } from '@mui/material';
import usePermissions from '@//common/hooks/usePermissions';
import useAuth from '@common/hooks/useAuth';

const Index: NextPage = () => {
  const { isAdmin, isManager, isUser } = usePermissions();
  const { user } = useAuth();
  return (
    <>
      <Box>
        {isAdmin && <Home />}
        {isManager && <Home />}
        {isUser && <UserDashboard />}
        {!isAdmin && !isManager && !isUser && <UserDashboard />}
      </Box>
    </>
  );
};

export default Index;
