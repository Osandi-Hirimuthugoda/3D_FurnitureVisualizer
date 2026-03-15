import axios from 'axios';

const API_BASE = 'http://localhost:5001/api/reviews';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getReviews = async () => {
  const { data } = await axios.get(API_BASE);
  return data;
};

export const submitReview = async ({ rating, comment }) => {
  const { data } = await axios.post(API_BASE, { rating, comment }, { headers: authHeader() });
  return data;
};
