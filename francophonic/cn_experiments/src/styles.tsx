import { StyleSheet } from "react-native";

const baseTheme = {
  nextButtonColor: '#3895D3',
  submitButtonColor: 'rgb(80, 200, 120)',
  buttonTextColor: 'rgb(255, 255, 255)',
  backgroundColor: '#fff',
  textColor: '#000',
  questionTextFontSize: 28,
  wordColorGradient: ['#BA0020', '#0BAB64', '#3BB78F', '#7CFFCB'],
}

export default StyleSheet.create({
  container: {
    backgroundColor: baseTheme.backgroundColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '5%',
    width: '100%',
    height: '100%',
  },
  submitButton: {
    width: "100%", height: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: "rgb(80, 200, 120)"
  },
  submitButtonText: {
    color: baseTheme.buttonTextColor,
    fontSize: 24,
  },

})