import axios from 'axios';

const API_BASE = '/api/designs';

export const createDesign = async (roomSpecs) => {
  const userId = localStorage.getItem('userEmail') || null;
  const { data } = await axios.post(API_BASE, { roomSpecs, userId });
  return data;
};

export const getDesign = async (id) => {
  const { data } = await axios.get(`${API_BASE}/${id}`);
  return data;
};

export const updateDesign = async (id, { roomSpecs, canvasItems }) => {
  const { data } = await axios.put(`${API_BASE}/${id}`, { roomSpecs, canvasItems });
  return data;
};

export const getRasterizedImage = async (id, options = {}) => {
  const { camera = 'perspective', lighting = 'day', shadows = true } = options;
  try {
    const response = await fetch(`${API_BASE}/${id}/rasterize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ camera, lighting, shadows })
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMsg = 'Rasterization failed';
      try {
        const json = JSON.parse(text);
        if (json.error) errorMsg = json.error;
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorMsg);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    throw err;
  }
};
