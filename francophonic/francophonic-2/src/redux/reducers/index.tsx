import { combineReducers } from 'redux'
import theme from './theme'
import editText from './editText'
import knowledge from './knowledge'

export default combineReducers({
  theme,
  editText,
  knowledge,
})