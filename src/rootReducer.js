import { combineReducers } from 'redux'
import { reducer as users } from './users'
import { reducer as socket } from './services/socket'
import { reducer as rooms } from './rooms'
import { reducer as room } from './rooms/room'
import { reducer as chat } from './chat'

export default combineReducers({
  users,
  socket,
  rooms,
  room,
  chat,
})
