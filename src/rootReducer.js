import { combineReducers } from 'redux'
import { reducer as user } from './user'
import { reducer as loginForm } from './user/loginForm'
import { reducer as registrationForm } from './user/registrationForm'
import { reducer as socket } from './common/socket'
import { reducer as dataChannel } from './common/dataChannel'
import { reducer as rooms } from './rooms'
import { reducer as chat } from './chat'
import { reducer as game } from './game'
import { reducer as gameMain } from './game/main'
import { reducer as evaluation } from './game/evaluation'

export default combineReducers({
  user,
  loginForm,
  registrationForm,
  socket,
  dataChannel,
  rooms,
  chat,
  game,
  gameMain,
  evaluation,
})
