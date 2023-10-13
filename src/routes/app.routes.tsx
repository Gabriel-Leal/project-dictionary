import { Platform } from "react-native";
import { useTheme } from "native-base";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import {
  House,
  ClockCounterClockwise,
  Star,
  UserCircle,
} from "phosphor-react-native";

import { Home } from "@screens/Home";
import { Word } from "@screens/Word";
import { History } from "@screens/History";
import { Favorite } from "@screens/Favorite";
import { Profile } from "@screens/Profile";

interface WordRouteParams {
  selectedWord: string;
}
type AppRoutes = {
  home: undefined;
  word: WordRouteParams;
  history: undefined;
  favorite: undefined;
  profile: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

// Use a hook to retrieve the tab bar options.
function useTabBarOptions() {
  const { sizes, colors } = useTheme();

  return {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarActiveTintColor: colors.green[500],
    tabBarInactiveTintColor: colors.gray[200],
    tabBarStyle: {
      backgroundColor: colors.gray[600],
      borderTopWidth: 0,
      height: Platform.OS === "android" ? "auto" : 96,
      paddingBottom: sizes[10],
      paddingTop: sizes[8],
    },
  };
}

// Function to render icons based on the route name.
function getTabBarIcon(route: keyof AppRoutes, color: string, size: number) {
  switch (route) {
    case "home":
      return <House size={size} color={color} />;
    case "history":
      return <ClockCounterClockwise size={size} color={color} />;
    case "favorite":
      return <Star size={size} color={color} />;
    case "profile":
      return <UserCircle size={size} color={color} />;
    default:
      return null;
  }
}

export function AppRoutes() {
  const tabBarOptions = useTabBarOptions();
  const { sizes } = useTheme();
  const iconSize = sizes[6];

  return (
    <Navigator screenOptions={tabBarOptions}>
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => getTabBarIcon("home", color, iconSize),
        }}
      />
      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => getTabBarIcon("history", color, iconSize),
        }}
      />
      <Screen
        name="favorite"
        component={Favorite}
        options={{
          tabBarIcon: ({ color }) => getTabBarIcon("favorite", color, iconSize),
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => getTabBarIcon("profile", color, iconSize),
        }}
      />
      <Screen
        name="word"
        component={Word}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Navigator>
  );
}
