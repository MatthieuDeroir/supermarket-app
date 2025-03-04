import axios, { AxiosInstance } from 'axios';
import { PUBLIC_API_BASE_URL } from '@env';
import { ID } from '@common/defs/types/id';

const ApiURL = PUBLIC_API_BASE_URL;
console.log('Hello i am the url :) ' + ApiURL);

const ApiRoutes = {
  Auth: {
    Login: '/auth/login',
    Register: '/auth/register',
    Logout: '/auth/logout',
    Me: '/auth/me',
    RequestPasswordReset: '/auth/request-password-reset',
    ResetPassword: '/auth/reset-password',
  },
  Users: {
    GetAll: '/users',
    GetById: (id: ID) => `/users/${id}`,
    Create: '/users',
    Update: (id: ID) => `/users/${id}`,
    Delete: (id: ID) => `/users/${id}`,
  },
  Products: {
    GetAll: '/products',
    GetById: (id: ID) => `/products/${id}`,
    Update: (id: ID) => `/products/${id}`,
    Delete: (id: ID) => `/products/${id}`,
    Create: '/products',
    GetByEan: (ean: string) => `/products/ean/${ean}`,
  },
  KpiLogs: {
    GetByLogsProductId: (id: ID, start: string, end: string) =>
      `/logs/product/${id}/daily?start=${start}&end=${end}`,
  },
  Addresses: {
    // Added from Postman collection
    GetAll: '/addresses',
    GetById: (id: ID) => `/addresses/${id}`,
    Create: '/addresses',
    Update: (id: ID) => `/addresses/${id}`,
    Delete: (id: ID) => `/addresses/${id}`,
  },
  Carts: {
    // Added from Postman collection
    GetAll: '/carts',
    GetById: (id: ID) => `/carts/${id}`,
    Create: '/carts',
    Update: (id: ID) => `/carts/${id}`,
    Delete: (id: ID) => `/carts/${id}`,
    AddProduct: '/carts/lines',
    Pay: (id: ID) => `/carts/${id}/pay`,
  },
  CartLines: {
    // Added from Postman collection
    GetAll: '/cart_lines',
    GetById: (id: ID) => `/cart_lines/${id}`,
    Create: '/lines', // Keep as /lines to match your API
    Update: (id: ID) => `/cart_lines/${id}`,
    Delete: (cartId: ID, lineId: ID) => `/carts/${cartId}/lines/${lineId}`,
  },
  Categories: {
    // Added from Postman collection
    GetAll: '/categories',
    GetById: (id: ID) => `/categories/${id}`,
    Create: '/categories',
    Update: (id: ID) => `/categories/${id}`,
    Delete: (id: ID) => `/categories/${id}`,
  },
  InvoiceLines: {
    // Added from Postman collection
    GetAll: '/invoice_lines',
    GetById: (id: ID) => `/invoice_lines/${id}`,
    Create: '/invoice_lines',
    Update: (id: ID) => `/invoice_lines/${id}`,
    Delete: (id: ID) => `/invoice_lines/${id}`,
  },
  Invoices: {
    // Added from Postman collection
    GetAll: '/invoices',
    GetById: (id: ID) => `/invoices/${id}`,
    GetByUserId: (userId: ID) => `/invoices/user/${userId}`,
    Create: '/invoices',
    Update: (id: ID) => `/invoices/${id}`,
    Delete: (id: ID) => `/invoices/${id}`,
  },
  Logs: {
    // Added from Postman collection
    GetAll: '/logs',
    GetById: (id: ID) => `/logs/${id}`,
    Create: '/logs',
    Update: (id: ID) => `/logs/${id}`,
    Delete: (id: ID) => `/logs/${id}`,
    GetDailyStocks: (productId: ID, start: string, end: string) =>
      `/logs/product/${productId}/daily?start=${start}&end=${end}`,
    GetByProductId: (productId: ID) => `/logs/product/${productId}`,
  },
  Promotions: {
    // Added from Postman collection
    GetAll: '/promotions',
    Create: '/promotions',
    GetById: (id: ID) => `/promotions/${id}`,
    Update: (id: ID) => `/promotions/${id}`,
    Delete: (id: ID) => `/promotions/${id}`,
    GetByProductId: (productId: ID) => `/promotions/product/${productId}`,
  },
  Roles: {
    // Added from Postman collection
    GetAll: '/roles',
    GetById: (id: ID) => `/roles/${id}`,
    Create: '/roles',
    Update: (id: ID) => `/roles/${id}`,
    Delete: (id: ID) => `/roles/${id}`,
  },
  OpenFoodFact: {
    // Added from Postman collection
    GetProductByEan: (ean: string) => `/openfood?ean=${ean}`,
    AddProductByEan: (ean: string) => `/openfood?ean=${ean}`,
  },
  Paypal: {
    // Added from Postman collection
    CreateOrder: '/paypal/create-order',
    ConfirmOrder: (orderId: string) => `/paypal/confirm?orderId=${orderId}`,
    CancelPayment: '/paypal/cancel',
  },
};

const api: AxiosInstance = axios.create();

// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.set('Authorization', `Bearer ${token}`);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

/* eslint-disable @typescript-eslint/no-explicit-any */
export const makeApiRequest = async (
  route: string | ((...args: any) => string),
  method: string = 'get',
  data: any = null,
  ...args: any
) => {
  const url = `${ApiURL}${typeof route === 'function' ? route(...args) : route}`;
  try {
    console.log('myurl ' + url + ' and what i\'m sending ' + data);
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
