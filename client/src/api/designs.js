import axios from 'axios';

const API_BASE = '/api/designs';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createDesign = async (roomSpecs, title = 'Untitled Design') => {
  const userId = localStorage.getItem('userEmail') || null;
  const { data } = await axios.post(API_BASE, { roomSpecs, title, userId }, { headers: authHeader() });
  return data;
};

export const getDesign = async (id) => {
  const { data } = await axios.get(`${API_BASE}/${id}`, { headers: authHeader() });
  return data;
};

export const getUserDesigns = async (userId) => {
  const { data } = await axios.get(`${API_BASE}/user/${userId}`);
  return data;
};

export const updateDesign = async (id, { roomSpecs, canvasItems, title }) => {
  const { data } = await axios.put(`${API_BASE}/${id}`, { roomSpecs, canvasItems, title }, { headers: authHeader() });
  return data;
};

export const getMyDesigns = async () => {
  const { data } = await axios.get(`${API_BASE}/my-designs`, { headers: authHeader() });
  return data;
};

export const deleteDesign = async (id) => {
  const { data } = await axios.delete(`${API_BASE}/${id}`, { headers: authHeader() });
  return data;
};

export const getRasterizedImage = async (id, options = {}) => {
  const { camera = 'perspective', lighting = 'day', shadows = true } = options;
  const response = await fetch(`${API_BASE}/${id}/rasterize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ camera, lighting, shadows })
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMsg = 'Rasterization failed';
    try {
      const json = JSON.parse(text);
      if (json.error) errorMsg = json.error;
    } catch (e) {}
    throw new Error(errorMsg);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
