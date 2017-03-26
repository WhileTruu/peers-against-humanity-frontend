import { combineReducers } from 'redux'
import { reducer as auth } from './authentication'
import { reducer as dataChannel } from './services/webRTCDataChannel'
import { reducer as socketService } from './services/webSocket'

export default combineReducers({
  auth,
  dataChannel,
  socketService,
})
