import * as React from "react";
import { useState, useEffect } from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import useStyle, { ThemeContext } from "../styles";

const Container = ({
  imageLight,
  imageDark,
  children,
}: {
  imageLight: ImageSourcePropType;
  imageDark: ImageSourcePropType;
  children: React.ReactNode;
}) => {
  const { styles } = useStyle();
  return (
    <ImageBackground
      source={React.useContext(ThemeContext).light ? imageLight : imageDark}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Container;
