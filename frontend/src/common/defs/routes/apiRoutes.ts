import { ID } from '@common/defs/types/id';

const ApiRoutes = {
  Auth: {
    Login: '/api/auth/login',
    Register: '/api/auth/register',
    Logout: '/api/auth/logout',
    Me: '/api/auth/me',
    RequestPasswordReset: '/api/auth/request-password-reset',
    ResetPassword: '/api/auth/reset-password',
  },
  Users: {
    GetAll: '/api/users',
    GetById: (id: ID) => `/api/users/${id}`,
    Update: (id: ID) => `/api/users/${id}/update`,
    Delete: (id: ID) => `/api/users/${id}/delete`,
  },
  // Add other routes as needed
};

export default ApiRoutes;
