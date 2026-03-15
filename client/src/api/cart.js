import axios from 'axios';

const API = 'http://localhost:5001/api/cart';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCart = () => axios.get(API, { headers: authHeader() }).then(r => r.data);
export const addToCart = (productId, quantity = 1) => axios.post(API, { productId, quantity }, { headers: authHeader() }).then(r => r.data);
export const updateQuantity = (productId, quantity) => axios.put(`${API}/${productId}`, { quantity }, { headers: authHeader() }).then(r => r.data);
export const removeFromCart = (productId) => axios.delete(`${API}/${productId}`, { headers: authHeader() }).then(r => r.data);
export const clearCart = () => axios.delete(`${API}/clear`, { headers: authHeader() }).then(r => r.data);
