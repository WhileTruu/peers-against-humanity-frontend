import PeerConnection from './peerConnection'

const sessionDescriptionProtocolConstraints = {
  mandatory: {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false,
  },
}

const peerConnectionConfig = {
  iceServers: [
    { url: 'stun:stun.services.mozilla.com' },
    { url: 'stun:stun.l.google.com:19302' },
  ],
}

class DataChannelService {
  constructor({ userId, wssAddress, peerConnections }) {
    this.webSocket = new WebSocket(wssAddress)
    this.userId = userId
    this.peerConnections = peerConnections
    this.onMessageFunction = null

    this.webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.peerId !== this.userId) return
      switch (message.action) {
        case 'REQUEST':
          this.setUpNewPeerConnection(message)
          break
        case 'RESPONSE':
          this.setUpRemotePeerConnection(message)
          break
        case 'ICE_CANDIDATE':
          this.addIceCandidate(message)
          break
        default:
          break
      }
    }
  }

  setOnMessageFunction(callback) {
    this.onMessageFunction = callback
  }

  // 1
  requestNewPeerConnection(peerId) {
    const peer = new PeerConnection(sessionDescriptionProtocolConstraints, peerConnectionConfig)
    peer.onIceCandidate(candidate => this.sendNegotiation('ICE_CANDIDATE', peerId, candidate))
    peer.onMessage(this.onMessageFunction)
    peer.createOffer((sessionDescriptionProtocol) => {
      this.sendNegotiation('REQUEST', peerId, sessionDescriptionProtocol)
    })
    this.peerConnections[peerId] = peer
  }

  // 2
  setUpNewPeerConnection(peerConnectionRequestEvent) {
    const peerId = peerConnectionRequestEvent.userId
    const peer = new PeerConnection(sessionDescriptionProtocolConstraints, peerConnectionConfig)
    peer.onIceCandidate(candidate => this.sendNegotiation('ICE_CANDIDATE', peerId, candidate))
    peer.onMessage(message => this.onMessageFunction(message))
    peer.setRemoteDescription(new RTCSessionDescription(peerConnectionRequestEvent.data))
    peer.createAnswer((sessionDescriptionProtocol) => {
      this.sendNegotiation('RESPONSE', peerId, sessionDescriptionProtocol)
    })
    this.peerConnections[peerId] = peer
  }

  // 3
  setUpRemotePeerConnection(peerConnectionResponseEvent) {
    const peerId = peerConnectionResponseEvent.userId
    const { data } = peerConnectionResponseEvent
    this.peerConnections[peerId].setRemoteDescription(new RTCSessionDescription(data))
  }

  addIceCandidate(event) {
    const peerId = event.userId
    const { data } = event
    this.peerConnections[peerId].addIceCandidate(data)
  }

  sendNegotiation(type, peerId, data) {
    this.webSocketServer.send(JSON.stringify({
      userId: this.userId,
      peerId,
      action: type,
      data,
    }))
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
}

export default DataChannelService
