import {
  addICECandidateToPeer,
  addRemoteDescriptionToPeer,
} from '../webRTCDataChannel/actions'
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

export function connect(url, token) {
  return (dispatch) => {
    dispatch({ type: SOCKET_IS_CONNECTING })
    WebSocketService.open(url, token)
    WebSocketService.webSocket.onopen = () => dispatch(isOpen())
    WebSocketService.webSocket.onclose = () => dispatch(isClosed())
    WebSocketService.webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      switch (message.type) {
        case 'UPDATE_ROOMS': {
          dispatch(roomsActions.updateRooms(message.availableRooms))
          break
        }
        case 'UPDATE_ROOM': {
          dispatch(roomsActions.updateRoom(message.room))
          break
        }
        case 'PEER_CONNECTION_OFFER': {
          const { peerId, sessionDescription } = message
          DataChannelService.onPeerConnectionOffer({ peerId, sessionDescription })
          break
        }
        case 'PEER_CONNECTION_ANSWER': {
          const { peerId, sessionDescription } = message
          dispatch(addRemoteDescriptionToPeer({ peerId, sessionDescription }))
          break
        }
        case 'ICE_CANDIDATE': {
          const { peerId, candidate } = message
          dispatch(addICECandidateToPeer({ peerId, candidate }))
          break
        }
        default:
          break
      }
    }
  }
}
