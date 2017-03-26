import {
  PEER_CONNECTION_ANSWER,
  PEER_CONNECTION_OFFER,
  peerConnectionEstablishmentAnswer,
  peerConnectionEstablishmentOffer,
  addICECandidateToPeer,
} from '../webRTCDataChannel/actions'
import {
  OPEN_WEBSOCKET,
  CLOSE_WEBSOCKET,
  SEND_WEBSOCKET_MESSAGE,
  ICE_CANDIDATE,
  socketConnectionIsOpen,
  socketConnectionIsClosed,
} from './actions'

class WebSocketService {
  constructor(url) {
    this.url = url
    this.webSocket = null
    this.dispatch = null
    this.middleware = this.middleware.bind(this)
  }

  close() {
    this.webSocket.close()
    this.webSocket = null
  }

  open() {
    if (this.webSocket) this.webSocket.close()
    this.webSocket = new WebSocket(`ws://${this.url}`)
    this.webSocket.onopen = () => this.dispatch(socketConnectionIsOpen())
    this.webSocket.onclose = () => this.dispatch(socketConnectionIsClosed())
    this.webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log(message)
      switch (message.type) {
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

  middleware({ getState, dispatch }) { // eslint-disable-line
    this.dispatch = dispatch
    return next => (action) => {
      // console.log(this)
      // console.log('will dispatch', action)
      switch (action.type) {
        case SEND_WEBSOCKET_MESSAGE: {
          this.send(action.data)
          break
        }
        case OPEN_WEBSOCKET: {
          this.open()
          break
        }
        case CLOSE_WEBSOCKET: {
          this.close()
          break
        }
        default:
          break
      }
      // Call the next dispatch method in the middleware chain.
      const returnValue = next(action)

      // console.log('state after dispatch', getState())

      // This will likely be the action itself, unless
      // a middleware further in chain changed it.
      return returnValue
    }
  }
}

export default WebSocketService
