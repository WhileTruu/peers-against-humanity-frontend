import { combineReducers } from 'redux'
import { reducer as auth } from './services/authService'

export default combineReducers({
  auth,
})
