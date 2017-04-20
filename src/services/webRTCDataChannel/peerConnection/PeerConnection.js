class PeerConnection {
  constructor(id, sdpConstraints, connectionConfig) {
    this.id = id
    this.sdpConstraints = sdpConstraints
    this.connection = new RTCPeerConnection(connectionConfig)
    this.dataChannel = this.connection.createDataChannel('datachannel', { reliable: false })
  }

  close() {
    this.connection.close()
  }

  createOffer(callback) {
    this.connection.createOffer(this.sdpConstraints)
      .then((sessionDescriptionProtocol) => {
        this.setLocalDescription(sessionDescriptionProtocol)
        callback(sessionDescriptionProtocol)
      })
      .catch((error) => { throw new Error(error) })
  }

  createAnswer(callback) {
    this.connection.createAnswer(this.sdpConstraints)
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
    return this.connection.setLocalDescription(sessionDescriptionProtocol)
  }

  setRemoteDescription(sessionDescriptionProtocol) {
    return this.connection
      .setRemoteDescription(new RTCSessionDescription(sessionDescriptionProtocol))
  }

  send(message) {
    this.dataChannel.send(JSON.stringify(message))
  }

  onDataChannel({ onMessageCallback, onCloseCallback, onDataChannelCallback }) {
    this.connection.ondatachannel = (event) => {
      onDataChannelCallback(this.id)
      // TODO: Find out if there is an airbnb-eslint compliant way to do this
      event.channel.onmessage = (message) => { // eslint-disable-line no-param-reassign
        onMessageCallback(JSON.parse(message.data))
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
    this.connection.onicecandidate = (event) => {
      if (this.connection && event && event.candidate) {
        callback(event.candidate)
      }
    }
  }

  addIceCandidate(candidate) {
    this.connection.addIceCandidate(new RTCIceCandidate(candidate))
      .catch((error) => { throw new Error(error) })
  }
}

export default PeerConnection
