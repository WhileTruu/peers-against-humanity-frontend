import {
  PEER_CONNECTION_ANSWER,
  PEER_CONNECTION_OFFER,
  peerConnectionEstablishmentAnswer,
  peerConnectionEstablishmentOffer,
  addICECandidateToPeer,
} from '../webRTCDataChannel/actions'
import {
  ICE_CANDIDATE,
  socketConnectionIsOpen,
  socketConnectionIsClosed,
} from './actions'
import { actions as roomsActions } from '../../rooms'

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
          this.dispatch(peerConnectionEstablishmentOffer({
            type: PEER_CONNECTION_OFFER,
            peerId,
            sessionDescription,
          }))
          break
        }
        case PEER_CONNECTION_ANSWER: {
          const { peerId, sessionDescription } = message
          this.dispatch(peerConnectionEstablishmentAnswer({
            type: PEER_CONNECTION_ANSWER,
            peerId,
            sessionDescription,
          }))
          break
        }
        case ICE_CANDIDATE: {
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
