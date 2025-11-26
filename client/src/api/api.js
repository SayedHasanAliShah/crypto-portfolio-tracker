import axios from 'axios';

const API_URL = 'http://192.168.0.103:3000/api'; // Updated to match current IP

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Portfolio API
export const getPortfolio = () => api.get('/portfolio');
export const addToPortfolio = (data) => api.post('/portfolio', data);
export const deleteFromPortfolio = (id) => api.delete(`/portfolio/${id}`);

// Alert API
export const getAlerts = () => api.get('/alerts');
export const createAlert = (data) => api.post('/alerts', data);
export const deleteAlert = (id) => api.delete(`/alerts/${id}`);
export const updateAlert = (id, data) => api.patch(`/alerts/${id}`, data);

export default api;
