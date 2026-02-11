import api from './client';

export const createItem = async (payload) => {
  const { data } = await api.post('/items', payload);
  return data;
};

export const getItems = async () => {
  const { data } = await api.get('/items');
  return data;
};

export const getItemByCode = async (code) => {
  const { data } = await api.get(`/items/${encodeURIComponent(code)}`);
  return data;
};
