import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
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
  Products: {
    GetAll: '/api/products',
    GetById: (id: ID) => `/api/products/${id}`,
    Update: (id: ID) => `/api/products/${id}/update`,
    Delete: (id: ID) => `/api/products/${id}/delete`,
    GetByEan: (ean: string) => `/api/products/ean/${ean}`,
  },
  KpiLogs: {
    GetByProductEan: (ean: string, start: string, end: string) =>
      `/api/logs/product/${ean}/daily?start=${start}&end=${end}`,
  },
  Addresses: {
    // Added from Postman collection
    GetAll: '/api/addresses',
    GetById: (id: ID) => `/api/addresses/${id}`,
    Create: '/api/addresses',
    Update: (id: ID) => `/api/addresses/${id}`,
    Delete: (id: ID) => `/api/addresses/${id}`,
  },
  Carts: {
    // Added from Postman collection
    GetAll: '/api/carts',
    GetById: (id: ID) => `/api/carts/${id}`,
    Create: '/api/carts',
    Update: (id: ID) => `/api/carts/${id}`,
    Delete: (id: ID) => `/api/carts/${id}`,
    AddProduct: '/api/carts/lines',
    Pay: (id: ID) => `/api/carts/${id}/pay`,
  },
  CartLines: {
    // Added from Postman collection
    GetAll: '/api/cart_lines',
    GetById: (id: ID) => `/api/cart_lines/${id}`,
    Create: '/api/lines', // Keep as /lines to match your API
    Update: (id: ID) => `/api/cart_lines/${id}`,
    Delete: (cartId: ID, lineId: ID) => `/api/carts/${cartId}/lines/${lineId}`,
  },
  Categories: {
    // Added from Postman collection
    GetAll: '/api/categories',
    GetById: (id: ID) => `/api/categories/${id}`,
    Create: '/api/categories',
    Update: (id: ID) => `/api/categories/${id}`,
    Delete: (id: ID) => `/api/categories/${id}`,
  },
  InvoiceLines: {
    // Added from Postman collection
    GetAll: '/api/invoice_lines',
    GetById: (id: ID) => `/api/invoice_lines/${id}`,
    Create: '/api/invoice_lines',
    Update: (id: ID) => `/api/invoice_lines/${id}`,
    Delete: (id: ID) => `/api/invoice_lines/${id}`,
  },
  Invoices: {
    // Added from Postman collection
    GetAll: '/api/invoices',
    GetById: (id: ID) => `/api/invoices/${id}`,
    GetByUserId: (userId: ID) => `/api/invoices/user/${userId}`,
    Create: '/api/invoices',
    Update: (id: ID) => `/api/invoices/${id}`,
    Delete: (id: ID) => `/api/invoices/${id}`,
  },
  Logs: {
    // Added from Postman collection
    GetAll: '/api/logs',
    GetById: (id: ID) => `/api/logs/${id}`,
    Create: '/api/logs',
    Update: (id: ID) => `/api/logs/${id}`,
    Delete: (id: ID) => `/api/logs/${id}`,
    GetDailyStocks: (productId: ID, start: string, end: string) =>
      `/api/logs/product/${productId}/daily?start=${start}&end=${end}`,
    GetByProductId: (productId: ID) => `/api/logs/product/${productId}`,
  },
  Promotions: {
    // Added from Postman collection
    GetAll: '/api/promotions',
    GetById: (id: ID) => `/api/promotions/${id}`,
    GetByProductId: (productId: ID) => `/api/promotions/product/${productId}`,
    Create: '/api/promotions',
    Update: (id: ID) => `/api/promotions/${id}`,
    Delete: (id: ID) => `/api/promotions/${id}`,
  },
  Roles: {
    // Added from Postman collection
    GetAll: '/api/roles',
    GetById: (id: ID) => `/api/roles/${id}`,
    Create: '/api/roles',
    Update: (id: ID) => `/api/roles/${id}`,
    Delete: (id: ID) => `/api/roles/${id}`,
  },
  OpenFoodFact: {
    // Added from Postman collection
    GetProductByEan: (ean: string) => `/api/openfood?ean=${ean}`,
  },
  Paypal: {
    // Added from Postman collection
    CreateOrder: '/api/paypal/create-order',
    ConfirmOrder: (orderId: string) => `/api/paypal/confirm?orderId=${orderId}`,
    CancelPayment: '/api/paypal/cancel',
  },
};

const api: AxiosInstance = axios.create();

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/* eslint-disable @typescript-eslint/no-explicit-any */
export const makeApiRequest = async (
  route: string | ((...args: any) => string),
  method: string = 'get',
  data: any = null,
  ...args: any
) => {
  const url = typeof route === 'function' ? route(...args) : route;
  try {
    const response = await api({
      method: method.toLowerCase(),
      url,
      data,
    });
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error);
    // ... (Error handling remains the same)
    throw error;
  }
};

export default ApiRoutes;
