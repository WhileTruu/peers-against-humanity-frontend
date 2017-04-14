import { combineReducers } from 'redux'
import { reducer as users } from './users'
import { reducer as dataChannel } from './services/webRTCDataChannel'
import { reducer as socketService } from './services/webSocket'
import { reducer as rooms } from './rooms'
import { reducer as room } from './rooms/room'
import { reducer as chat } from './chat'

export default combineReducers({
  users,
  dataChannel,
  socketService,
  rooms,
  room,
  chat,
})
