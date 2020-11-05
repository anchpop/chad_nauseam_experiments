import * as React from "react";
import { useState, useEffect } from 'react';
import { View, Text, TextInput, ImageBackground, ImageSourcePropType } from 'react-native';

import useStyle, { ThemeContext } from "../styles"

const Container = ({ imageLight, imageDark, children }: { imageLight: ImageSourcePropType, imageDark: ImageSourcePropType, children: React.ReactNode }) => {
    const { styles } = useStyle()
    return (
        <ImageBackground source={React.useContext(ThemeContext).light ? imageLight : imageDark} style={styles.background}>
            <View style={styles.container}>
                {children}
            </View>
        </ImageBackground>
    )
}

export default Container