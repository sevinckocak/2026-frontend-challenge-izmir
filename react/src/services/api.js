import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.jotform.com',
  params: {
    apiKey: import.meta.env.VITE_JOTFORM_API_KEY,
    limit: 1000,
  },
});

export default api;
