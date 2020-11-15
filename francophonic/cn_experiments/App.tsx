import * as React from "react";
import { useColorScheme, useWindowDimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";

import ReviewScreen from "./src/ReviewScreen";
import { ThemeContext } from "./src/styles";

const Stack = createStackNavigator();

const App = () => {
  const isMobileDevice = useMediaQuery({
    maxDeviceWidth: 1224,
  });
  const systemPrefersDark = false ? useColorScheme() !== "light" : false;

  return (
    <ThemeContext.Provider
      value={{ light: !systemPrefersDark, mobile: isMobileDevice }}
    >
      <ReviewScreen />
    </ThemeContext.Provider>
  );
};

export default App;
