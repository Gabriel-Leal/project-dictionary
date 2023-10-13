import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "@dtos/UserDTO";
import { USER_STORAGE } from "@storage/storageConfig";

// Save the user's data in AsyncStorage using the predefined key from storageConfig
export async function storageUserSave(user: UserDTO){
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

// Fetch and parse the user's data from AsyncStorage
export async function storageUserGet(){
    const storage = await AsyncStorage.getItem(USER_STORAGE);

    // Parse the user data, if available. Return an empty object otherwise.
    const user: UserDTO = storage ? JSON.parse(storage): {};
    return user;
}

// Remove the user's data from AsyncStorage
export async function storageUserRemove(){
    await AsyncStorage.removeItem(USER_STORAGE);
}
