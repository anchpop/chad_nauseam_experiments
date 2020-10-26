import * as React from "react";
import { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';

import style from "../styles"

const Container: React.FC<{}> = ({ children }) => (
    <View style={style.container}>{children}</View>
)

export default Container