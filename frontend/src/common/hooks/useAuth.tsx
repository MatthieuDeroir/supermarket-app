import axios from 'axios';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import ApiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
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
  const { data: user, mutate } = useSWR<User | null>('authUser', null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const storedData = localStorage.getItem('authUser');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.expiresAt && Date.now() > parsedData.expiresAt) {
        // Expired, remove from localStorage
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
      } else {
        mutate(parsedData.user);
      }
    }
    setInitialized(true);
  }, []);

  const login = async (input: LoginInput) => {
    try {
      const response = await makeApiRequest(ApiRoutes.Auth.Login, 'POST', {
        email: input.email,
        password: input.password,
      });
      const expirationTime = Date.now() + 60 * 60 * 1000;

      localStorage.setItem('authToken', response.token); // Stocker le token
      localStorage.setItem(
        'authUser',
        JSON.stringify({ user: response.user, expiresAt: expirationTime }),
      );

      mutate(response.user);

      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response ? error.response.data.message : 'Login failed';
      return { success: false, errors: [errorMessage] };
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const response = await axios.post(ApiRoutes.Auth.Register, input);
      const { token, user: userData } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(userData));

      mutate(userData);
      return { success: true, user: userData };
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
      localStorage.removeItem('authUser');
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
