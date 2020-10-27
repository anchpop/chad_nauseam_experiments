import * as React from "react";
import { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';

import useStyle from "../styles"

const Container: React.FC<{}> = ({ children }) => {
    const style = useStyle()
    return (
        <View style={style.background}>
            <View style={style.container}>
                {children}
            </View>
        </View>
    )
}

export default Container