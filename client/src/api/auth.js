const API_URL = 'http://localhost:5001/api';

// Admin Login
export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  return data;
};

// Customer Signup
export const customerSignup = async (fullName, email, password, organization) => {
  const response = await fetch(`${API_URL}/auth/customer/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fullName, email, password, organization })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }
  
  return data;
};

// Customer Login
export const customerLogin = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/customer/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  return data;
};

// Get Current User
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to get user');
  }
  
  return data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('isAuthenticated');
};
