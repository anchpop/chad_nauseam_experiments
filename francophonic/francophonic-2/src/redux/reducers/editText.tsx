const editText = (state = {textBoxContent: "", submittted: false, performanceModifiers: []}, action) => {
    switch (action.type) {
      case 'EDIT_TEXT':
        return {
          ...state,
          textBoxContent: action.newText
        }
      case 'SUBMIT':
        return {
          ...state,
          submitted: true,
          performanceModifiers: action.initialModifiers
        }
      case 'MODIFY_PERFORMANCE':
        return {
          ...state,
          performanceModifiers: action.performanceModifiers
        }
      default:
        return state
    }
  }
  
  export default editText