import { ReactNode, createContext, useEffect, useState } from "react";
import {
  storageAuthTokenSave,
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from "@storage/storageAuthToken";
import {
  storageUserSave,
  storageUserGet,
  storageUserRemove,
} from "@storage/storageUser";
import { api, axiosInstance } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";
import { useToast } from "native-base";
import { AppError } from "@utils/AppError";
import { useAuth } from "@hooks/useAuth";

// Type declarations for the AuthContext and its provider props
export type AuthContextDataProps = {
  user: UserDTO;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
  fetchWords: () => Promise<{ word: string }[]>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
};
type AuthContextProviderProps = {
  children: ReactNode;
};

// Context initialization
export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  // State declarations
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);
  const toast = useToast();

  // Helper function to set token in headers and update user state
  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  }

  // Helper function to save user and token to local storage
  async function storageUserAndTokenSave(
    userData: UserDTO,
    token: string,
    refresh_token: string
  ) {
    await storageUserSave(userData);
    await storageAuthTokenSave({ token, refresh_token });
  }

  // Sign-in function
  async function signIn(email: string, password: string) {
    const data = await api.signIn(email, password);
    if (data.user && data.token && data.refresh_token) {
      setIsLoadingUserStorageData(true);
      await storageUserAndTokenSave(data.user, data.token, data.refresh_token);
      userAndTokenUpdate(data.user, data.token);
      setIsLoadingUserStorageData(false);
    } else {
      console.log("API response missing required data");
    }
  }

  // Sign-out function
  async function signOut() {
    setUser({} as UserDTO);
    await storageUserRemove();
    await storageAuthTokenRemove();
  }

  // Function to update user profile both in state and storage
  async function updateUserProfile(userUpdated: UserDTO) {
    setUser(userUpdated);
    await storageUserSave(userUpdated);
  }

  // Function to fetch words with error handling
  async function fetchWords(): Promise<{ word: string }[]> {
    try {
      const response = await api.getWords({ user_id: user.id });

      return response;
    } catch (error) {
      // Error handling logic here
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "It is not possible to fetch the words. Try again later.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
      throw error;
    }
  }

  // Function to load user data and token from local storage
  async function loadUserData() {
    const userLogged = await storageUserGet();
    const { token } = await storageAuthTokenGet();

    if (token && userLogged) {
      userAndTokenUpdate(userLogged, token);
    }
    setIsLoadingUserStorageData(false);
  }

  // Effect to load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Effect to setup interceptor for token management
  useEffect(() => {
    const unsubscribe = axiosInstance.registerInterceptTokenManager(signOut);
    return () => {
      unsubscribe();
    };
  }, [signOut]);

  // Context Provider Render
  return (
    <AuthContext.Provider
      value={{
        user,
        updateUserProfile,
        fetchWords,
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
