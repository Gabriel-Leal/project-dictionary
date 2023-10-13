import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { SignIn } from "@screens/SignIn";
import { SignUp } from "@screens/SignUp";

// Define route types for authentication.
type AuthRoutes = {
  signIn: undefined;
  signUp: undefined;
};

// Define navigation prop types for the authentication routes.
export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

// Component defining the authentication routes.
export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="signIn" component={SignIn} />
      <Screen name="signUp" component={SignUp} />
    </Navigator>
  );
}
