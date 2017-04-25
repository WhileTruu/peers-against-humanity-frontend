import PeerConnection from './peerConnection'
import WebSocketService from '../webSocket'
import { actions as roomActions } from '../../rooms/room'
import {
  peerConnectionConfig,
  sessionDescriptionProtocolConstraints as sdpConstraints,
} from './config'

class DataChannelService {
  constructor() {
    this.peerConnections = null
    this.onClose = (id) => {
      this.dispatch(roomActions.removeMember(id))
      this.closePeerConnection(id)
    }
    this.onDataChannel = (id) => {
      if (id === this.getState().room.ownerId) WebSocketService.close()
      this.dispatch(roomActions.hasDataChannel(id))
    }
  }

  addPeer(id, peer) {
    this.peerConnections = { ...this.peerConnections, [id]: peer }
    setTimeout(() => {
      if (!peer.dataChannel.readyState === 'open') this.closePeerConnection(id)
    }, 5000)
  }

  closePeerConnection(peerId) {
    if (this.getState().users.user.id === parseInt(peerId, 10) || !this.peerConnections[peerId]) {
      return
    }
    const { [`${peerId}`]: deletedPeer, ...peerConnections } = this.peerConnections
    deletedPeer.close()
    this.peerConnections = peerConnections
  }

  closeAllPeerConnections() {
    if (!this.peerConnections) return
    Object.keys(this.peerConnections).forEach(key => (
      this.closePeerConnection(key)
    ))
  }

  requestNewPeerConnection(to) {
    if (this.getState().users.user.id === parseInt(to, 10)) return
    if (this.peerConnections &&
      Object.keys(this.peerConnections).includes(to.toString()) &&
      this.peerConnections[to].dataChannel.readyState !== 'closed'
    ) {
      return
    }

    const peer = new PeerConnection(to, sdpConstraints, peerConnectionConfig)
    peer.onIceCandidate(candidate => (
      this.send({
        type: 'ICE_CANDIDATE',
        from: this.getState().users.user.id,
        to,
        candidate,
      })
    ))
    peer.onDataChannel({
      onMessageCallback: this.onDataChannelMessage.bind(this),
      onCloseCallback: this.onClose.bind(this),
      onDataChannelCallback: this.onDataChannel.bind(this),
    })
    peer.createOffer(localSessionDescription => (
      this.send({
        type: 'PEER_CONNECTION_OFFER',
        from: this.getState().users.user.id,
        to,
        user: this.getState().users.user,
        sessionDescription: localSessionDescription,
      })
    ))
    this.addPeer(to, peer)
  }

  onPeerConnectionOffer(message) {
    const { from, sessionDescription } = message
    if (this.peerConnections && Object.keys(this.peerConnections).includes(from.toString())) {
      return
    }

    const peer = new PeerConnection(from, sdpConstraints, peerConnectionConfig)
    peer.onIceCandidate((candidate) => {
      this.send({
        type: 'ICE_CANDIDATE',
        from: this.getState().users.user.id,
        to: from,
        candidate,
      })
    })
    peer.onDataChannel({
      onMessageCallback: this.onDataChannelMessage.bind(this),
      onCloseCallback: this.onClose.bind(this),
      onDataChannelCallback: this.onDataChannel.bind(this),
    })
    peer.setRemoteDescription(new RTCSessionDescription(sessionDescription))
    peer.createAnswer(localDescription => (
      this.send({
        type: 'PEER_CONNECTION_ANSWER',
        from: this.getState().users.user.id,
        to: from,
        user: this.getState().users.user,
        sessionDescription: localDescription,
      })
    ))
    this.dispatch(roomActions.addMember(message.user))
    this.addPeer(from, peer)
  }

  addICECandidateToPeer({ from, candidate }) {
    this.peerConnections[from].addIceCandidate(candidate)
  }

  onPeerConnectionAnswer(message) {
    this.peerConnections[message.from].setRemoteDescription(message.sessionDescription)
    this.dispatch(roomActions.addMember(message.user))
  }

  broadcastToDataChannel(message, exclude = null) {
    if (this.peerConnections) {
      Object.keys(this.peerConnections).forEach((key) => {
        if (!(parseInt(key, 10) === exclude)) this.peerConnections[key].send(message)
      })
    }
  }

  send(message) {
    const { ownerId } = this.getState().room
    if (this.peerConnections[ownerId] &&
      this.peerConnections[ownerId].dataChannel.readyState === 'open'
    ) {
      this.peerConnections[this.getState().room.ownerId].send(message)
    } else {
      WebSocketService.send(message)
    }
  }

  relayMessage(message) {
    this.peerConnections[parseInt(message.to, 10)].send(message)
  }

  onPeerConnectionMessage(data, onMessageFunction) {
    if (data.to === this.getState().users.user.id) {
      onMessageFunction.bind(this)(data)
    } else {
      this.relayMessage(data)
    }
  }

  onDataChannelMessage(message) {
    switch (message.type) {
      case 'CHAT_MESSAGE':
        this.dispatch(message)
        break
      case 'PEER_CONNECTION_OFFER':
        this.onPeerConnectionMessage(message, this.onPeerConnectionOffer)
        break
      case 'PEER_CONNECTION_ANSWER':
        this.onPeerConnectionMessage(message, this.onPeerConnectionAnswer)
        break
      case 'ICE_CANDIDATE':
        this.onPeerConnectionMessage(message, this.addICECandidateToPeer)
        break
      case 'ADD_MEMBER': {
        if (this.peerConnections && this.peerConnections[message.user.id]) break
        this.broadcastToDataChannel(message, message.user.id)
        this.requestNewPeerConnection(message.user.id)
        break
      }
      default:
        break
    }
  }
}

const instance = new DataChannelService()

export default instance
