const dataChannelMiddleware = (() => {
  const peerConnections = {}

  requestNewPeerConnection = (socket, store) => {

  }

  return store => next => (action) => {
    switch(action.type) {
      case 'NEW_POTENTIAL_PEER':
        requestNewPeerConnection(webSocket, store)
        break
    }
  }
})
