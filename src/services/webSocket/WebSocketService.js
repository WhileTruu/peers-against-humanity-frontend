import {
  PEER_CONNECTION_ANSWER,
  PEER_CONNECTION_OFFER,
  addICECandidateToPeer,
  addRemoteDescriptionToPeer,
} from '../webRTCDataChannel/actions'
import {
  socketConnectionIsOpen,
  socketConnectionIsClosed,
} from './actions'
import { actions as roomsActions } from '../../rooms'
import DataChannelService from '../webRTCDataChannel'

const UPDATE_ROOM = 'UPDATE_ROOM'
const UPDATE_AVAILABLE_ROOMS = 'UPDATE_AVAILABLE_ROOMS'

class WebSocketService {
  constructor() {
    this.webSocket = null
    this.dispatch = null
  }

  close() {
    this.webSocket.close()
    this.webSocket = null
  }

  open(url, token) {
    if (this.webSocket) this.webSocket.close()
    this.webSocket = new WebSocket(`ws://${url}`, token)
    this.webSocket.onopen = () => this.dispatch(socketConnectionIsOpen())
    this.webSocket.onclose = () => this.dispatch(socketConnectionIsClosed())
    this.webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      switch (message.type) {
        case UPDATE_AVAILABLE_ROOMS: {
          this.dispatch(roomsActions.updateAvailableRooms(message.availableRooms))
          break
        }
        case UPDATE_ROOM: {
          this.dispatch(roomsActions.updateRoom(message.room))
          break
        }
        case PEER_CONNECTION_OFFER: {
          const { peerId, sessionDescription } = message
          DataChannelService.onPeerConnectionOffer({ peerId, sessionDescription })
          break
        }
        case PEER_CONNECTION_ANSWER: {
          const { peerId, sessionDescription } = message
          this.dispatch(addRemoteDescriptionToPeer({ peerId, sessionDescription }))
          break
        }
        case 'ICE_CANDIDATE': {
          const { peerId, candidate } = message
          this.dispatch(addICECandidateToPeer({ peerId, candidate }))
          break
        }
        default:
          break
      }
    }
  }

  send(data) {
    this.webSocket.send(JSON.stringify(data))
  }
}

const instance = new WebSocketService()

export default instance
