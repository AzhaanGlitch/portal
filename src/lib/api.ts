import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Get the backend URL from environment variables, with a fallback for local development
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Create a single, centralized Axios instance
const api = axios.create({
    baseURL: `${backendUrl}/api`,
    // This is crucial for the browser to send HttpOnly cookies
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// --- State for Token Refresh Mechanism ---
// This prevents multiple, simultaneous token refresh requests.
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: Error | null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            // When the token is refreshed, we don't pass a new token here.
            // We just resolve the promise, and the original request will be retried.
            prom.resolve(true);
        }
    });
    failedQueue = [];
};

// --- Response Interceptor for Handling Token Expiration ---
api.interceptors.response.use(
    // If the response is successful, just return it.
    (response) => response,
    
    // If the response has an error, handle it.
    async (error: AxiosError) => {
        // We need to use a custom interface to add our custom '_retry' flag
        interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
            _retry?: boolean;
        }
        const originalRequest: CustomAxiosRequestConfig = error.config!;

        // Check if the error is a 401 Unauthorized and we haven't already retried the request.
        // if (error.response?.status === 401 && !originalRequest._retry) {
        //     // If a refresh is already in progress, queue the failed request.
        //     if (isRefreshing) {
        //         return new Promise((resolve, reject) => {
        //             failedQueue.push({ resolve, reject });
        //         })
        //         .then(() => api(originalRequest)) // Retry the request once the token is refreshed
        //         .catch(err => Promise.reject(err));
        //     }

        //     // Mark that we are now refreshing the token.
        //     originalRequest._retry = true;
        //     isRefreshing = true;

        //     try {
        //         console.log("Access token expired. Attempting to refresh...");
        //         // The refresh request itself. No payload is needed as the refresh token
        //         // is an HttpOnly cookie sent automatically by the browser.
        //         await api.post('/accounts/token/refresh/');
                
        //         console.log("Token refresh successful.");

        //         // Process the queue of failed requests and retry them.
        //         processQueue(null);

        //         // Retry the original failed request.
        //         return api(originalRequest);

        //     } catch (refreshError: any) {
        //         console.error("Unable to refresh token:", refreshError);
                
        //         // If the refresh fails, reject all queued requests.
        //         processQueue(refreshError);
                
        //         // Here you would typically trigger a global logout state.
        //         // Forcing a redirect is a simple and effective way to handle this.
        //         if (typeof window !== 'undefined') {
        //             // Redirecting to login page after failed refresh
        //             window.location.href = '/auth/';
        //         }

        //         return Promise.reject(refreshError);
        //     } finally {
        //         // Reset the refreshing flag.
        //         isRefreshing = false;
        //     }
        // }

        // For all other errors, just reject the promise.
        return Promise.reject(error);
    }
);

export default api;