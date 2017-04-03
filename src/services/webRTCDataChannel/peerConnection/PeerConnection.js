class PeerConnection {
  constructor(id, sessionDescriptionProtocolConstraints, peerConnectionConfig) {
    this.id = id
    this.sessionDescriptionProtocolConstraints = sessionDescriptionProtocolConstraints
    this.connection = {}
    this.peerConnection = new RTCPeerConnection(peerConnectionConfig, this.connection)
    this.dataChannel = this.peerConnection.createDataChannel('datachannel', { reliable: false })
  }

  close() {
    this.peerConnection.close()
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

  onDataChannel({ onMessageCallback, onCloseCallback }) {
    this.peerConnection.ondatachannel = (event) => {
      // TODO: Find out if there is an airbnb-eslint compliant way to do this
      event.channel.onmessage = (message) => { // eslint-disable-line no-param-reassign
        onMessageCallback(message)
      }
      event.channel.onclose = () => { // eslint-disable-line no-param-reassign
        onCloseCallback(this.id)
      }
      event.channel.onerror = (errorEvent) => { // eslint-disable-line no-param-reassign
        console.log(errorEvent) // eslint-disable-line
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
