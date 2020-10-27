import * as React from 'react'
import { StyleSheet } from "react-native";

import chroma from 'chroma-js'


export interface ThemeInfo {
  light: Boolean,
  mobile: Boolean
}

const baseTheme = {
  nextButtonColor: '#3895D3',
  submitButtonColor: 'rgb(80, 200, 120)',
  buttonTextColor: 'rgb(255, 255, 255)',
  backgroundColor: '#fff',
  textColor: '#000',
  fontSize: 28,
  wordColorGradient: ['#BA0020', '#0BAB64', '#3BB78F', '#7CFFCB'],
}



export const styles = ({ light, mobile }: ThemeInfo) => StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    backgroundColor: baseTheme.backgroundColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: mobile ? '2%' : '0%',
    width: mobile ? '100%' : "50%",
  },

  // Review Screen
  questionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: "100%",
    height: "100%",
  },
  questionText: {
    fontSize: baseTheme.fontSize
  },
  answerContainer: {
    flex: 5,
    width: "100%",
    height: "100%"
  },
  answerTextInput: {
    width: "100%",
    height: "100%",
    textAlignVertical: 'top',
    fontSize: baseTheme.fontSize
  },
  submitButtonContainer: {
    flex: 1,
    marginTop: 4,
    backgroundColor: "red",
    width: "100%",
    height: "100%",
  },
  submitButton: {
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: baseTheme.submitButtonColor
  },
  submitButtonText: {
    color: baseTheme.buttonTextColor,
    fontSize: 24,
  },


})

export const ThemeContext = React.createContext({ light: true, mobile: true } as ThemeInfo)

export default () => styles(React.useContext(ThemeContext))