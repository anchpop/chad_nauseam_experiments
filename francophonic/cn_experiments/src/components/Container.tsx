import * as React from "react";
import { useState, useEffect } from 'react';
import { View, Text, TextInput, ImageBackground, ImageSourcePropType } from 'react-native';

import useStyle, { ThemeContext } from "../styles"

const Container = ({ imageLight, imageDark, children }: { imageLight: ImageSourcePropType, imageDark: ImageSourcePropType, children: React.ReactNode }) => {
    const style = useStyle()
    return (
        <ImageBackground source={React.useContext(ThemeContext).light ? imageLight : imageDark} style={style.background}>
            <View style={style.container}>
                {children}
            </View>
        </ImageBackground>
    )
}

export default Container