import PeerConnection from './peerConnection'
import { actions as socketActions } from '../socket'
import { actions as roomActions } from '../../rooms/room'
import { roomActionTypes } from '../../rooms/room/actions'
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
  }

  addPeer(id, peer) {
    this.peerConnections = { ...this.peerConnections, [id]: peer }
    setTimeout(() => {
      if (!peer.dataChannel.readyState === 'open') this.closePeerConnection(id)
    }, 5000)
  }

  closePeerConnection(peerId) {
    if (this.getState().user.id === parseInt(peerId, 10) || !this.peerConnections[peerId]) {
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
    if (this.getState().user.id === parseInt(to, 10)) return
    if (this.peerConnections &&
      Object.keys(this.peerConnections).includes(to.toString()) &&
      this.peerConnections[to].dataChannel.readyState !== 'closed'
    ) {
      return
    }

    const peer = new PeerConnection(to, sdpConstraints, peerConnectionConfig)
    peer.onIceCandidate(candidate => (
      this.message({
        type: 'ICE_CANDIDATE',
        from: this.getState().user.id,
        to,
        candidate,
      }).relay()
    ))
    peer.onDataChannel({
      onMessageCallback: this.onDataChannelMessage.bind(this),
      onCloseCallback: this.onClose.bind(this),
      onDataChannelCallback: this.onDataChannel.bind(this),
    })
    peer.createOffer(localSessionDescription => (
      this.message({
        type: 'PEER_CONNECTION_OFFER',
        from: this.getState().user.id,
        to,
        user: this.getState().user,
        sessionDescription: localSessionDescription,
      }).relay()
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
      this.message({
        type: 'ICE_CANDIDATE',
        from: this.getState().user.id,
        to: from,
        candidate,
      }).relay()
    })
    peer.onDataChannel({
      onMessageCallback: this.onDataChannelMessage.bind(this),
      onCloseCallback: this.onClose.bind(this),
      onDataChannelCallback: this.onDataChannel.bind(this),
    })
    peer.setRemoteDescription(new RTCSessionDescription(sessionDescription))
    peer.createAnswer(localDescription => (
      this.message({
        type: 'PEER_CONNECTION_ANSWER',
        from: this.getState().user.id,
        to: from,
        user: this.getState().user,
        sessionDescription: localDescription,
      }).relay()
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

  message(message) {
    const broadcast = (userToExcludeId = null) => {
      if (this.peerConnections) {
        Object.keys(this.peerConnections).forEach((key) => {
          if (!(parseInt(key, 10) === userToExcludeId)) this.peerConnections[key].send(message)
        })
      }
    }
    const send = (userId) => {
      this.peerConnections[parseInt(userId, 10)].send(message)
    }
    const relay = () => {
      const { ownerId } = this.getState().room
      if (this.peerConnections[ownerId] &&
        this.peerConnections[ownerId].dataChannel.readyState === 'open'
      ) {
        this.peerConnections[this.getState().room.ownerId].send(message)
      } else {
        this.dispatch(socketActions.send(message))
      }
    }
    return {
      exclude: userToExcludeId => ({ broadcast() { broadcast(userToExcludeId) } }),
      broadcast() { broadcast() },
      relay() { relay(message) },
      to: userId => ({ send() { send(userId) } }),
    }
  }

  onDataChannelMessage(message) {
    const state = this.getState()
    if (message.to && message.to !== state.user.id) {
      this.message(message).to(message.to).send()
      return
    }

    switch (message.type) {
      case 'CHAT_MESSAGE':
        this.dispatch(message)
        break
      case 'PEER_CONNECTION_OFFER':
        this.onPeerConnectionOffer(message)
        break
      case 'PEER_CONNECTION_ANSWER':
        this.onPeerConnectionAnswer(message)
        break
      case 'ICE_CANDIDATE':
        this.addICECandidateToPeer(message)
        break
      case 'NEW_MEMBER': {
        if (this.peerConnections && this.peerConnections[message.from]) break
        this.requestNewPeerConnection(message.from)
        break
      }
      case 'JOINED_ROOM': {
        this.dispatch(roomActions.joinedRoom(message.room))
        break
      }
      default:
        if (roomActionTypes.includes(message.type)) this.dispatch(message)
        break
    }
  }

  onDataChannel(id) {
    const state = this.getState()

    this.dispatch(roomActions.hasDataChannel(id))
    if (state.user.id === state.room.ownerId) {
      this.message({
        type: 'JOINED_ROOM',
        from: state.user.id,
        to: id,
        room: state.room,
      }).to(id).send()
      this.message({ type: 'NEW_MEMBER', from: id }).exclude(id).broadcast()
    }
  }
}

const instance = new DataChannelService()

export default instance
