// API Configuration
// This file centralizes all API endpoint URLs

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  LOGOUT: `${API_BASE_URL}/api/logout`,
  ME: `${API_BASE_URL}/api/me`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/api/orders`,
  ORDER_SEARCH: `${API_BASE_URL}/api/orders/search`,
  ORDER_STATISTICS: `${API_BASE_URL}/api/orders/statistics`,
  ORDER_EMPLOYEE_OVERVIEW: `${API_BASE_URL}/api/orders/employee-overview`,
  
  // Analytics
  ANALYTICS: `${API_BASE_URL}/api/analytics`,
};

export default API_BASE_URL;

