// @ts-ignore
import { createTheming } from '@callstack/react-theme-provider';
import Color from 'color';
import * as _ from "lodash";

interface ThemeObjectInput {
  isDarkTheme: boolean,
  colors: {
    backgroundColor: Color,
    textColor: Color,
    headerColor: Color,
    headerTextColor: Color,
    buttonColor: Color,
    buttonTextColor: Color,
    secondaryColor: Color,
    noticeColor: Color,
    backgroundColorAttention?: Color,
    buttonColorDisabled?: Color,
    goodColor?: Color,
    badColor?: Color,
  }
}
interface ThemeObjectInputFilled {
  isDarkTheme: boolean,
  colors: {
    backgroundColor: Color,
    textColor: Color,
    headerColor: Color,
    headerTextColor: Color,
    buttonColor: Color,
    buttonTextColor: Color,
    secondaryColor: Color,
    noticeColor: Color,
    backgroundColorAttention: Color,
    buttonColorDisabled: Color,
    goodColor: Color,
    badColor: Color,
  }
}

export interface ThemeObject {
  isDarkTheme: boolean,
  colors: {
    backgroundColor: string,
    textColor: string,
    headerColor: string,
    headerTextColor: string,
    buttonColor: string,
    buttonTextColor: string,
    secondaryColor: string,
    noticeColor: string,
    backgroundColorAttention: string,
    buttonColorDisabled: string,
    goodColor: string,
    badColor: string,
  }
}


function createTheme(theme: ThemeObjectInput): ThemeObject {
  const multiplier = theme.isDarkTheme ? -1 : 1
  let filledTheme: ThemeObjectInputFilled  = {
    ...theme,
    colors: {
      backgroundColorAttention: theme.isDarkTheme ? theme.colors.backgroundColor.lighten(.09) : theme.colors.backgroundColor.darken(.09), // 9% darker
      buttonColorDisabled: theme.colors.buttonColor.alpha(0.3),
      goodColor: theme.colors.buttonColor,
      badColor: theme.colors.noticeColor,
      ...theme.colors,
    }
  }
  // @ts-ignore
  let filledThemeConverted: ThemeObject = {...filledTheme, colors: _.mapValues(filledTheme.colors, (v) => v.hsl().string())}
  return filledThemeConverted
}

let whiteTheme = createTheme({ 
  isDarkTheme: false,
  colors: {
    backgroundColor: Color('#F0F0F0'),
    textColor: Color("#000000"),
    headerColor: Color("#FFFFFF"),
    headerTextColor: Color("#000000"),
    buttonColor: Color("#3369E8"),
    buttonTextColor: Color("#FFFFFF"),
    secondaryColor: Color("#253C78"),
    noticeColor: Color("#D36582"),
  }
})

let brownAndGreenTheme = createTheme({ 
  isDarkTheme: false,
  colors: {
    backgroundColor: Color("#FFEECF"),
    textColor: Color("#000000"),
    headerColor: Color("#C9A690"),
    headerTextColor: Color("#000000"),
    buttonColor: Color("#C1D37F"),
    buttonTextColor: Color("#FFFFFF"),
    secondaryColor: Color("#664E4C"),
    noticeColor: Color("#D36582"),
  }
})

let oledTheme = createTheme({ 
  isDarkTheme: true,
  colors: {
    backgroundColor: Color("#000000"),
    backgroundColorAttention: Color("#2A2A2A"),
    textColor: Color("#FFFFFF"),
    headerColor: Color("#0F0F0F"),
    headerTextColor: Color("#FFFFFF"),
    buttonColor: Color("#000000"),
    buttonTextColor: Color("#FFFFFF"),
    secondaryColor: Color("#664E4C"),
    noticeColor: Color("#D36582"),
  }
})


let defaultTheme = brownAndGreenTheme


const themes:{[index:string] : ThemeObject} = {
  'default': defaultTheme,
  'white': whiteTheme,
  'oled': oledTheme
}

const { ThemeProvider, withTheme } = createTheming({});

export { themes, ThemeProvider, withTheme };
