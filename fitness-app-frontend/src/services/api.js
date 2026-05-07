import axios from 'axios';
const API_URL = 'http://localhost:9090/api';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    const userId = localStorage.getItem('userid');
    if (userId) {
        config.headers['X-User-Id'] = userId;
        // Inject userId into request body if it's a mutation and doesn't have it
        if (['post', 'put', 'patch'].includes(config.method) && config.data) {
            if (typeof config.data === 'object' && !config.data.userId) {
                config.data.userId = userId;
            }
        }
    }
    return config;
})
export const getActivities = (userId) => api.get(`/activities/user/${userId}`);
export const getActivity = (id) => api.get(`/activities/${id}`);
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);

