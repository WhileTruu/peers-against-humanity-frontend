import { combineReducers } from 'redux'
import { reducer as user } from './user'
import { reducer as loginForm } from './user/loginForm'
import { reducer as registrationForm } from './user/registrationForm'
import { reducer as socket } from './common/socket'
import { reducer as rooms } from './rooms'
import { reducer as room } from './rooms/room'
import { reducer as chat } from './chat'

export default combineReducers({
  user,
  loginForm,
  registrationForm,
  socket,
  rooms,
  room,
  chat,
})
