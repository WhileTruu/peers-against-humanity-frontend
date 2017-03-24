import { combineReducers } from 'redux'
import { reducer as auth } from './authentication'

export default combineReducers({
  auth,
})
