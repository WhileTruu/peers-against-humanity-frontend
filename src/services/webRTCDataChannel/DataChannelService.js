import PeerConnection from './peerConnection'
import WebSocketService from '../webSocket'
import {
  PEER_CONNECTION_ANSWER,
  PEER_CONNECTION_OFFER,
  addPeer,
  removePeer,
  onDataChannelMessage,
} from './actions'
import {
  peerConnectionConfig,
  sessionDescriptionProtocolConstraints as sdpConstraints,
} from './config'

class DataChannelService {
  constructor() {
    this.onMessage = message => this.dispatch(onDataChannelMessage(message))
    this.onClose = id => this.dispatch(removePeer(id))
  }

  setOnMessageCallback(callback) {
    this.onMessageFunction = callback
  }

  requestNewPeerConnection(peerId) {
    const peer = new PeerConnection(peerId, sdpConstraints, peerConnectionConfig)
    peer.onIceCandidate(candidate => (
      WebSocketService.send({ type: 'ICE_CANDIDATE', peerId, candidate })
    ))
    peer.onDataChannel({
      onMessageCallback: this.onMessage,
      onCloseCallback: this.onClose,
    })
    peer.createOffer(localSessionDescription => (
      WebSocketService.send({
        type: PEER_CONNECTION_OFFER,
        peerId,
        sessionDescription: localSessionDescription,
      })
    ))
    this.dispatch(addPeer(peerId, peer))
  }

  onPeerConnectionOffer({ peerId, sessionDescription }) {
    const peer = new PeerConnection(peerId, sdpConstraints, peerConnectionConfig)
    peer.onIceCandidate(candidate => (
      WebSocketService.send({ type: 'ICE_CANDIDATE', peerId, candidate })
    ))
    peer.onDataChannel({
      onMessageCallback: this.onMessage,
      onCloseCallback: this.onClose,
    })
    peer.setRemoteDescription(new RTCSessionDescription(sessionDescription))
    peer.createAnswer(localDescription => (
      WebSocketService.send({
        type: PEER_CONNECTION_ANSWER,
        peerId,
        sessionDescription: localDescription,
      })
    ))
    this.dispatch(addPeer(peerId, peer))
  }
}

const instance = new DataChannelService()

export default instance
