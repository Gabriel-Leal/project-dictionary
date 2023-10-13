// Import necessary libraries and utilities
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_STORAGE } from "@storage/storageConfig";

// Type definition for the authentication token structure saved in AsyncStorage
type StorageAuthTokenProps = {
    token: string;
    refresh_token: string;
}

/**
 * Save the token and refresh_token to AsyncStorage.
 * 
 * @param {string} token - User's JWT token
 * @param {string} refresh_token - Token used to refresh the user's JWT when it expires
 */
export async function storageAuthTokenSave({ token, refresh_token }: StorageAuthTokenProps) {
    await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, JSON.stringify({ token, refresh_token }));
}

/**
 * Retrieve the token and refresh_token from AsyncStorage.
 * 
 * @returns {Object} An object containing the user's JWT token and the associated refresh token.
 */
export async function storageAuthTokenGet() {
    const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);

    const { token, refresh_token }: StorageAuthTokenProps = response ? JSON.parse(response) : {};
    return { token, refresh_token };
}

/**
 * Remove the token and refresh_token from AsyncStorage.
 */
export async function storageAuthTokenRemove() {
    await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
}
