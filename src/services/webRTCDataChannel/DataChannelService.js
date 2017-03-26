import PeerConnection from './peerConnection'
import { ICE_CANDIDATE, actions as webSocketActions } from '../webSocket'
import {
  PEER_CONNECTION_ANSWER,
  PEER_CONNECTION_OFFER,
  REQUEST_NEW_PEER,
  addRemoteDescriptionToPeer,
  addPeer,
} from './actions'
import { peerConnectionConfig, sessionDescriptionProtocolConstraints } from './config'

class DataChannelService {
  constructor() {
    this.peerConnections = null
    this.onMessageFunction = null
    this.middleware = this.middleware.bind(this)
  }

  setOnMessageFunction(callback) {
    this.onMessageFunction = callback
  }

  requestNewPeerConnection(peerId) {
    const peer = new PeerConnection(sessionDescriptionProtocolConstraints, peerConnectionConfig)
    peer.onIceCandidate(candidate => (
      this.sendNegotiation({ type: ICE_CANDIDATE, peerId, candidate })
    ))
    peer.onMessage(this.onMessageFunction)
    peer.createOffer(localSessionDescription => (
      this.sendNegotiation({
        type: PEER_CONNECTION_OFFER,
        peerId,
        sessionDescription: localSessionDescription,
      })
    ))
    this.addPeer(peerId, peer)
  }

  onPeerConnectionOffer({ peerId, sessionDescription }) {
    const peer = new PeerConnection(sessionDescriptionProtocolConstraints, peerConnectionConfig)
    peer.onIceCandidate(candidate => (
      this.sendNegotiation({ type: ICE_CANDIDATE, peerId, candidate })
    ))
    peer.onMessage(message => this.onMessageFunction(message))
    peer.setRemoteDescription(new RTCSessionDescription(sessionDescription))
    peer.createAnswer(localDescription => (
      this.sendNegotiation({
        type: PEER_CONNECTION_ANSWER,
        peerId,
        sessionDescription: localDescription,
      })
    ))
    this.addPeer(peerId, peer)
  }

  sendNegotiation({ type, peerId, ...data }) {
    this.dispatch(webSocketActions.sendWebSocketMessage({ type, peerId, ...data }))
  }

  send(message) {
    return ({
      to: peerId => this.peerConnections[peerId].sendMessage(message),
    })
  }

  broadcast(data) {
    Object.entries(this.peerConnections)
      .forEach(([key, value]) => value.dataChannel.send(data)) // eslint-disable-line no-unused-vars
  }

  addPeer(peerId, peer) {
    this.dispatch(addPeer(peerId, peer))
  }

  middleware({ getState, dispatch }) { // eslint-disable-line
    this.dispatch = dispatch
    return next => (action) => {
      switch (action.type) {
        case REQUEST_NEW_PEER: {
          console.log(action)
          const { peerId } = action
          this.requestNewPeerConnection(peerId)
          break
        }
        case PEER_CONNECTION_OFFER: {
          console.log(action)
          const { peerId, sessionDescription } = action
          this.onPeerConnectionOffer({ peerId, sessionDescription })
          break
        }
        case PEER_CONNECTION_ANSWER: {
          console.log(action)
          const { peerId, sessionDescription } = action
          this.dispatch(
            addRemoteDescriptionToPeer({ peerId, sessionDescription }),
          )
          break
        }
        // case NEW_PEERS: {
        //   const { peerIds } = action
        //   peerIds.map(peerId => this.requestNewPeerConnection(peerId))
        //   break
        // }
        default:
          break
      }
      return next(action)
    }
  }
}

export default DataChannelService
