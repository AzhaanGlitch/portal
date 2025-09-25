import axios from 'axios';

// Get the backend URL from environment variables, with a fallback for local development
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Create a single, centralized Axios instance
const api = axios.create({
    baseURL: `${backendUrl}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default api;