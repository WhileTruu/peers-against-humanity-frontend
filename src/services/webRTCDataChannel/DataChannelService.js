import PeerConnection from './peerConnection'
import WebSocketService from '../webSocket'
import {
  addPeer,
  removePeer,
  onMessage,
  connected,
} from './actions'
import {
  peerConnectionConfig,
  sessionDescriptionProtocolConstraints as sdpConstraints,
} from './config'

class DataChannelService {
  constructor() {
    this.peerConnections = null
    this.onMessage = message => this.dispatch(onMessage(message))
    this.onClose = id => this.dispatch(removePeer(id))
    this.onDataChannel = id => this.dispatch(connected(id))
  }

  setOnMessageCallback(callback) {
    this.onMessage = callback
  }

  addPeer(peerId, peer) {
    this.dispatch(addPeer(peerId))
    this.peerConnections = { ...this.peerConnections, [peerId]: peer }
  }

  removePeer(peerId) {
    if (this.getState().users.user.id === parseInt(peerId, 10) || !this.peerConnections[peerId]) {
      return
    }
    this.dispatch(removePeer(peerId))
    const { [`${peerId}`]: deletedPeer, ...peerConnections } = this.peerConnections
    deletedPeer.close()
    this.peerConnections = peerConnections
  }

  // TODO: As of yet this is used nowhere. See if is useful on exit room.
  removeAllPeers() {
    Object.keys(this.peerConnections).forEach(key => (
      this.peerConnections[key].close()
    ))
    this.peerConnections = null
  }

  requestNewPeerConnection(peerId) {
    if (this.getState().users.user.id === parseInt(peerId, 10)) return
    if (this.peerConnections && Object.keys(this.peerConnections).includes(peerId.toString())) {
      return
    }

    const peer = new PeerConnection(peerId, sdpConstraints, peerConnectionConfig)
    peer.onIceCandidate(candidate => (
      WebSocketService.send({ type: 'ICE_CANDIDATE', peerId, candidate })
    ))
    peer.onDataChannel({
      onMessageCallback: this.onMessage,
      onCloseCallback: this.onClose,
      onDataChannelCallback: this.onDataChannel,
    })
    peer.createOffer(localSessionDescription => (
      WebSocketService.send({
        type: 'PEER_CONNECTION_OFFER',
        peerId,
        sessionDescription: localSessionDescription,
      })
    ))
    this.addPeer(peerId, peer)
  }

  onPeerConnectionOffer({ peerId, sessionDescription }) {
    if (this.peerConnections && Object.keys(this.peerConnections).includes(peerId.toString())) {
      return
    }

    const peer = new PeerConnection(peerId, sdpConstraints, peerConnectionConfig)
    peer.onIceCandidate(candidate => (
      WebSocketService.send({ type: 'ICE_CANDIDATE', peerId, candidate })
    ))
    peer.onDataChannel({
      onMessageCallback: this.onMessage,
      onCloseCallback: this.onClose,
      onDataChannelCallback: this.onDataChannel,
    })
    peer.setRemoteDescription(new RTCSessionDescription(sessionDescription))
    peer.createAnswer(localDescription => (
      WebSocketService.send({
        type: 'PEER_CONNECTION_ANSWER',
        peerId,
        sessionDescription: localDescription,
      })
    ))
    this.addPeer(peerId, peer)
  }

  addICECandidateToPeer({ peerId, candidate }) {
    this.peerConnections[peerId].addIceCandidate(candidate)
  }

  addRemoteDescriptionToPeer({ peerId, sessionDescription }) {
    this.peerConnections[peerId].setRemoteDescription(sessionDescription)
  }

  broadcastToDataChannel(message) {
    if (this.peerConnections) {
      Object.keys(this.peerConnections).forEach((key) => {
        this.peerConnections[key].send(message)
      })
    }
  }
}

const instance = new DataChannelService()

export default instance
