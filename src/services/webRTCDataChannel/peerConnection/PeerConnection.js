class PeerConnection {
  constructor(sessionDescriptionProtocolConstraints, peerConnectionConfig) {
    this.sessionDescriptionProtocolConstraints = sessionDescriptionProtocolConstraints
    this.connection = {}
    this.peerConnection = new RTCPeerConnection(peerConnectionConfig, this.connection)
    this.dataChannel = this.peerConnection.createDataChannel('datachannel', { reliable: false })
  }

  createOffer(callback) {
    this.peerConnection.createOffer(this.sessionDescriptionProtocolConstraints)
      .then((sessionDescriptionProtocol) => {
        this.setLocalDescription(sessionDescriptionProtocol)
        callback(sessionDescriptionProtocol)
      })
      .catch((error) => { throw new Error(error) })
  }

  createAnswer(callback) {
    this.peerConnection.createAnswer(this.sessionDescriptionProtocolConstraints)
      .then((sessionDescriptionProtocol) => {
        this.setLocalDescription(sessionDescriptionProtocol)
          .then(() => {
            callback(sessionDescriptionProtocol)
          })
          .catch((error) => { throw new Error(error) })
      })
      .catch((error) => { throw new Error(error) })
  }

  setLocalDescription(sessionDescriptionProtocol) {
    return this.peerConnection.setLocalDescription(sessionDescriptionProtocol)
  }

  setRemoteDescription(sessionDescriptionProtocol) {
    return this.peerConnection.setRemoteDescription(sessionDescriptionProtocol)
  }

  sendMessage(message) {
    this.dataChannel.send(message)
  }

  onMessage(callback) {
    this.peerConnection.ondatachannel = (event) => {
      // TODO: Find out if there is an airbnb-eslint compliant way to do this
      event.channel.onmessage = (message) => { // eslint-disable-line no-param-reassign
        callback(message)
      }
    }
  }

  onIceCandidate(callback) {
    this.peerConnection.onicecandidate = (event) => {
      if (this.peerConnection && event && event.candidate) {
        callback(event.candidate)
      }
    }
  }

  addIceCandidate(candidate) {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      .catch((error) => { throw new Error(error) })
  }
}

export default PeerConnection
