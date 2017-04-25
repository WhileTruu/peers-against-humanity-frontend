import { actions as roomsActions } from '../../rooms'
import DataChannelService from '../webRTCDataChannel'
import WebSocketService from './WebSocketService'

export const SOCKET_IS_OPEN = 'SOCKET_IS_OPEN'
export const SOCKET_IS_CLOSED = 'SOCKET_IS_CLOSED'
export const SOCKET_IS_CONNECTING = 'SOCKET_IS_CONNECTING'

export function isOpen() {
  return { type: SOCKET_IS_OPEN }
}

export function isClosed() {
  return { type: SOCKET_IS_CLOSED }
}

export function connect(token) {
  return (dispatch) => {
    dispatch({ type: SOCKET_IS_CONNECTING })
    WebSocketService.open(token)
    WebSocketService.webSocket.onopen = () => WebSocketService.send({ type: 'VERIFY', token })
    WebSocketService.webSocket.onclose = () => dispatch(isClosed())
    WebSocketService.webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      switch (message.type) {
        case 'VERIFIED': {
          dispatch(isOpen())
          break
        }
        case 'NOT_VERIFIED': {
          dispatch(isClosed())
          break
        }
        case 'UPDATE_LIST_ROOMS': {
          dispatch(roomsActions.updateRooms(message.rooms))
          break
        }
        case 'UPDATE_LIST_ROOM': {
          dispatch(roomsActions.updateRoom(message.room))
          break
        }
        default:
          DataChannelService.onDataChannelMessage(message)
          break
      }
    }
  }
}
