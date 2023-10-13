import { useTheme, Box } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAuth } from "@hooks/useAuth";
import { Loading } from "@components/Loading";

export function Routes() {
  // Extracting the colors from the native-base theme
  const { colors } = useTheme();

  // Get user details and the loading state from the useAuth hook
  const { user, isLoadingUserStorageData } = useAuth();

  // Define the theme for the navigation container
  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  // Display the loading component when user data is being fetched
  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {/* Display the AppRoutes if user is authenticated, otherwise show the AuthRoutes */}
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
