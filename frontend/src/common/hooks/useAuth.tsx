import axios from 'axios';
import useSWR from 'swr';
import { useState } from 'react';
import ApiRoutes from '@common/defs/routes/apiRoutes';
import { User } from '@common/defs/types/user';

export interface LoginInput {
  email: string;
  password: string;
  admin?: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface RequestPasswordResetInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  password: string;
  passwordConfirmation: string;
  token: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface AuthData {
  user: User | null;
  login: (input: LoginInput) => Promise<any>;
  register: (input: RegisterInput) => Promise<any>;
  logout: () => Promise<any>;
  requestPasswordReset: (input: RequestPasswordResetInput) => Promise<any>;
  resetPassword: (input: ResetPasswordInput) => Promise<any>;
  initialized: boolean;
}

const useAuth = (): AuthData => {
  const [initialized, setInitialized] = useState<boolean>(false);

  const { data: user, mutate } = useSWR<User | null>(ApiRoutes.Auth.Me, async (url: string) => {
    if (!localStorage.getItem('authToken')) {
      setInitialized(true);
      return null;
    }

    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );
      setInitialized(true);
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('authToken');
      setInitialized(true);
      console.error('Login failed', error);
      return null;
    }
  });

  const login = async (input: LoginInput) => {
    try {
      const response = await axios.post(ApiRoutes.Auth.Login, input);
      localStorage.setItem('authToken', response.data.token);
      mutate();
      return response.data;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response ? error.response.data.message : 'Login failed';
      return { success: false, errors: [errorMessage] };
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const response = await axios.post(ApiRoutes.Auth.Register, input);
      localStorage.setItem('authToken', response.data.token);
      mutate();
      return response.data;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Registration failed';
      return { success: false, errors: [errorMessage] };
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        ApiRoutes.Auth.Logout,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );
      localStorage.removeItem('authToken');
      mutate(null);
      return { success: true };
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response ? error.response.data.message : 'Logout failed';
      return { success: false, errors: [errorMessage] };
    }
  };

  const requestPasswordReset = async (input: RequestPasswordResetInput) => {
    try {
      const response = await axios.post(ApiRoutes.Auth.RequestPasswordReset, input);
      return response.data;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Request failed';
      return { success: false, errors: [errorMessage] };
    }
  };

  const resetPassword = async (input: ResetPasswordInput) => {
    try {
      const response = await axios.post(ApiRoutes.Auth.ResetPassword, input);
      return response.data;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response ? error.response.data.message : 'Reset failed';
      return { success: false, errors: [errorMessage] };
    }
  };

  return {
    user: user ?? null,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    initialized,
  };
};

export default useAuth;
