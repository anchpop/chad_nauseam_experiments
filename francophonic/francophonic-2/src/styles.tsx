import { Button, StyleSheet, Text, View } from 'react-native';
import chroma from 'chroma-js'

export enum Theme {
  Light,
  Dark
}

export const baseTheme = {
  nextButtonColor: '#3895D3',
  submitButtonColor: 'rgb(80, 200, 120)',
  buttonTextColor: 'rgb(255, 255, 255)',
  backgroundColor: '#fff',
  textColor: '#000',
  questionTextFontSize: 28,
  wordColorGradient: ['#BA0020', '#0BAB64', '#3BB78F', '#7CFFCB'],
}

export const getThemeInfo = (theme: Theme) => {
  let themeInfo = {}
  if (theme === Theme.Light) themeInfo = {
    backgroundColor: '#fff',
    textColor: '#000',
    placeholderTextColor: '#E0E0E0',
  }
  else themeInfo = {
    backgroundColor: '#000',
    textColor: '#fff',
    placeholderTextColor: '#FAFAFA',
  }

  let affect = (c, n) => chroma(c).darken(n)
  let disaffect = (c, n) => chroma(c).brighten(n)
  if (theme !== Theme.Light) {
    affect = (c, n) => chroma(c).brighten(n)
    disaffect = (c, n) => chroma(c).darken(n)
  }

  const combinedThemes = { ...baseTheme, ...themeInfo }
  return {
    ...combinedThemes,
    submitButtonDisabledColor: disaffect(combinedThemes.submitButtonColor, 2)
  }
}


export const styles = (theme) => {
  const themeInfo = getThemeInfo(theme)
  return {
    headerStyle: {
      backgroundColor: themeInfo.backgroundColor,
    },
    ...StyleSheet.create({
      container: {
        backgroundColor: themeInfo.backgroundColor,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        padding: '2%',
        width: '100%',
        height: '100%',
      },
      textbox: {
        borderColor: 'rgba(0, 0, 0, 0.0)',
        borderWidth: 1,
        flex: 5,
        padding: "1%",
        textAlignVertical: 'top',
      },
      mainButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeInfo.submitButtonColor,
      },
      nextButton: {
        backgroundColor: themeInfo.nextButtonColor,
      },
      submitButtonDisabled: {
        backgroundColor: themeInfo.submitButtonDisabledColor,
      },
      submitButtonText: {
        color: themeInfo.buttonTextColor,
        fontSize: 24,
      },
      questionText: {
        color: themeInfo.textColor,
        fontSize: 24,
      },
    }),
    ...themeInfo,
    audioButtonSize: 30,
  };
}
