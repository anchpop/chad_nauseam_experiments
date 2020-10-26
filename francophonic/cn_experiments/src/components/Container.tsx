import * as React from "react";
import { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';

import style from "../styles"

interface IProps {
    children: React.ReactNode;
    // any other props that come into the component
}

const Container = ({ children }: IProps) => (
    <View style={style.container}>{children}</View>
)

export default Container