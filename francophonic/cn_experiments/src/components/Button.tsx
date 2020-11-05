import * as React from "react";
import { useState, useEffect } from 'react';
import { ViewStyle, Pressable } from 'react-native';

import useStyle from "../styles"

const Button = ({ style, children }: { style: ViewStyle, children: React.ReactNode }) => {
    const { buttonStyle } = useStyle()
    return (
        <Pressable style={(i) => ([buttonStyle(i), style])} >
            {children}
        </Pressable>
    )
}

export default Button