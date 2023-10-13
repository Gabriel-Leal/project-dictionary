import { TouchableOpacity } from "react-native";
import { HStack, VStack, Heading, Text, Icon } from "native-base";
import { UserPhoto } from "./UserPhoto";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@hooks/useAuth";
import defaultUserPhotoImg from "@assets/userPhotoDefault.png";
import { axiosInstance } from "@services/api";

/**
 * HomeHeader component.
 *
 * This component displays the user's photo, greeting message and a logout button.
 * It uses the authenticated user's data from the useAuth hook.
 * If the user does not have an avatar, a default image is shown.
 *
 */
export function HomeHeader() {
  const { user, signOut } = useAuth();

  // Determine the source of the user's photo, using a default if the user doesn't have an avatar.
  const userPhotoSource = user.avatar
    ? { uri: `${axiosInstance.defaults.baseURL}/avatar/${user.avatar}` }
    : defaultUserPhotoImg;

  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto source={userPhotoSource} alt="User picture" size={16} mr={4} />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Hello,
        </Text>
        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={signOut}>
        <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  );
}
