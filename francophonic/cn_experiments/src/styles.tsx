import * as React from 'react'
import { StyleSheet } from "react-native";


import chroma from 'chroma-js'
import { modulo } from 'react-native-reanimated';


export interface ThemeInfo {
  light: Boolean,
  mobile: Boolean
}

const baseTheme = ({ light, mobile }: ThemeInfo) => ({
  nextButtonColor: '#3895D3',
  submitButtonColor: 'rgb(80, 200, 120)',
  buttonTextColor: 'rgb(255, 255, 255)',
  backgroundColor: '#fff',
  textColor: '#000',
  fontSize: mobile ? 24 : 28,
  wordColorGradient: ['#BA0020', '#0BAB64', '#3BB78F', '#7CFFCB'],
})



export const styles = ({ light, mobile }: ThemeInfo) => {
  const base = baseTheme({ light, mobile })

  let affect = (c: any, n: number) => "" + chroma(c).darken(n)
  let disaffect = (c: any, n: number) => "" + chroma(c).brighten(n)
  if (light) {
    affect = (c: any, n: number) => "" + chroma(c).brighten(n)
    disaffect = (c: any, n: number) => "" + chroma(c).darken(n)
  }

  const shadowedLight = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  }

  const shadowedDeep = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,

    elevation: 13,
  }


  return {
    styles: StyleSheet.create({
      background: {
        flex: 1,
        alignItems: 'center',
      },
      container: {
        backgroundColor: base.backgroundColor,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: mobile ? '2%' : '0%',
        marginVertical: mobile ? "0%" : '1%',
        borderRadius: mobile ? 0 : 20,
        width: mobile ? '100%' : 1000,
        ...(mobile ? {} : shadowedDeep)
      },

      // Review Screen
      questionContainer: {
        flex: mobile ? 1.1 : .7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: "100%",
        height: "100%",
      },
      answerContainer: {
        flex: 5,
        width: "100%",
        height: "100%"
      },
      submitButtonContainer: {
        flex: 1,
        paddingVertical: mobile ? 10 : 25,
        width: "100%",
      },
      questionText: {
        fontSize: base.fontSize
      },
      answerTextInput: {
        width: "100%",
        height: "100%",
        textAlignVertical: 'top',
        fontSize: base.fontSize,
        padding: 10,
        borderColor: '#fff',
        backgroundColor: disaffect(base.backgroundColor, .2),
        borderRadius: 6,
      },
      submitButton: {
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: base.submitButtonColor
      },
      submitButtonText: {
        color: base.buttonTextColor,
        fontSize: 24,
      },
    }),
    // General
    buttonStyle: ({ pressed }: { pressed: Boolean }) => ({
      opacity: pressed ? .5 : 1,
      borderRadius: 600,
      ...shadowedLight
    }),
  }
}

export const ThemeContext = React.createContext({ light: true, mobile: true } as ThemeInfo)

export default () => styles(React.useContext(ThemeContext))