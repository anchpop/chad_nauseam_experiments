import { Theme } from "../../styles"
const theme = (state = {currentTheme: Theme.Light}, action) => {
    switch (action.type) {
      case 'SET_THEME':
        return {
          ...state,
          currentTheme: action.themeToSet
        }
      default:
        return state
    }
  }
  
  export default theme