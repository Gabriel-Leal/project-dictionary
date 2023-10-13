// Import necessary libraries and utilities
import { storageAuthTokenGet, storageAuthTokenSave } from '@storage/storageAuthToken';
import { AppError } from '@utils/AppError';
import axios, { AxiosInstance, AxiosError } from 'axios';

// Type definition for a logout function
type SignOut = () => void;

// Type definition for promises waiting in line for a refreshed token
type PromiseType = {
    onSuccess: (token: string) => void;
    onFailure: (error: AxiosError) => void
}

// Type definition for a custom Axios instance with additional token interceptor registration
type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

// Custom Axios instance for communicating with the application's backend
const axiosInstance = axios.create({
    baseURL: 'http://192.168.2.15:3333'
}) as APIInstanceProps;

// Variables to handle the token refresh process
let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

// Method to intercept and handle token renewal
axiosInstance.registerInterceptTokenManager = signOut => {
    const interceptTokenManager = axiosInstance.interceptors.response.use(response => response, async (requestError) => {
        // If the response indicates the user is unauthenticated
        if (requestError?.response?.status === 401) {
            // If the token is expired or invalid
            if (requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
                const { refresh_token } = await storageAuthTokenGet();
                const originalRequestConfig = requestError.config;

                // If no refresh_token is present, log out the user
                if (!refresh_token) {
                    signOut();
                    return Promise.reject(requestError);
                }

                // If a token refresh is already in progress, queue the request
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({
                            onSuccess: (token: string) => {
                                originalRequestConfig.headers = { 'Authorization': `Bearer ${token}` };
                                resolve(axiosInstance(originalRequestConfig));
                            },
                            onFailure: (error: AxiosError) => {
                                reject(error);
                            }
                        });
                    })
                }

                isRefreshing = true;

                // Attempt to fetch a new token using the refresh_token
                return new Promise(async (resolve, reject) => {
                    try {
                        const { data } = await api.requestToken(refresh_token);
                        await storageAuthTokenSave({ token: data.token, refresh_token: data.refresh_token });

                        if (originalRequestConfig.data) {
                            originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
                        }

                        // Update the original request's headers with the new token and set the default axios header to use the new token for subsequent requests
                        originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}` };
                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

                        // Retry all the requests that were in queue waiting for token renewal
                        failedQueue.forEach(request => {
                            request.onSuccess(data.token)
                        })

                        resolve(axiosInstance(originalRequestConfig));
                    } catch (error: any) {
                        // If an error occurs, reject all pending requests
                        failedQueue.forEach(async request => {
                            request.onFailure(error);
                        })
                        signOut();
                        reject(error);
                    } finally {
                        isRefreshing = false;
                        failedQueue = [];
                    }
                })
            }

            signOut();
        }

        // If an error occurs, whether related to token or not, reject the promise and report the error
        if (requestError.response && requestError.response.data) {
            return Promise.reject(new AppError(requestError.response.data.message));
        } else {
            return Promise.reject(new AppError(requestError.message || "Unknown error"));
        }
    });

    // Return a function to deregister the interceptor (useful when the user logs out and you don't want the interceptor to remain active)
    return () => {
        axiosInstance.interceptors.response.eject(interceptTokenManager);
    };
}

// Axios instance for an external API (dictionary)
const dictionaryApi = axios.create({
    baseURL: 'https://api.dictionaryapi.dev/api/v2/entries/en'
});

export { axiosInstance, dictionaryApi }

// API call definitions
export const api = {
    // User registration
    async signUp(name: string, email: string, password: string) {
        const response = await axiosInstance.post("/users", { name, email, password });
        return response.data;
    },

    // User authentication
    async signIn(email: string, password: string) {
        const response = await axiosInstance.post("/sessions", { email, password });
        return response.data;
    },

    // Fetching words (could be user-specific words, translations, etc.)
    async getWords(data: {user_id:number}) {
        const response = await axiosInstance.get("/words", { params: data });
        return response.data;
    },

    // Update word as favorite
    async sendFavoriteUpdate(data: { word: string; favorite: string, user_id: number }) {
        const response = await axiosInstance.post("/favorite", data);
        return response.data;
    },

    // Log word search in user's history
    async sendHistory(data: { word: string; user_id: number }) {
        const response = await axiosInstance.post("/history", data);
        return response.data;
    },

    // Retrieve user's word search history
    async getHistory(data: {user_id:number}) {
        const response = await axiosInstance.get("/history", { params: data });
        return response.data;
    },

    // Retrieve user's favorite words
    async getFavorites(data: {user_id:number}) {
        const response = await axiosInstance.get("/favorite", { params: data });
        return response.data;
    },

    // Update user's personal information
    async updateUsers(data: { name: string, password: string, old_password: string }) {
        const response = await axiosInstance.put("/users", data);
        return response.data;
    },

    // Update user's avatar
    async updateAvatar(data: any) {
        const response = await axiosInstance.patch("/users/avatar", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Obtain a new token using the refresh_token
    async requestToken(refresh_token: string) {
        const response = await axiosInstance.post("/sessions/refresh-token", { refresh_token });
        return response.data;
    },
};
