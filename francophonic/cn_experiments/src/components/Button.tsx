import * as React from "react";
import { useState, useEffect } from 'react';
import { ViewStyle, TouchableOpacity } from 'react-native';

import useStyle from "../styles"

const Button = ({ style, children }: { style: ViewStyle, children: React.ReactNode }) => {
    const styles = useStyle()
    return (
        <TouchableOpacity style={[styles.Button, style]} >
            {children}
        </TouchableOpacity>
    )
}

export default Button