export const ADD_PEER = 'ADD_PEER'
export const REMOVE_PEER = 'REMOVE_PEER'
export const CONNECTED = 'CONNECTED'

export function addPeer(id) {
  return (dispatch) => {
    dispatch({ type: ADD_PEER, id })
  }
}

export function removePeer(id) {
  return (dispatch) => {
    dispatch({ type: REMOVE_PEER, id })
  }
}

export function connected(id) {
  return (dispatch) => {
    dispatch({ type: CONNECTED, id })
  }
}

export function addICECandidateToPeer({ peerId, candidate }) {
  return (dispatch) => {
    dispatch({ type: ADD_ICE_CANDIDATE_TO_PEER, peerId, candidate })
  }
}

export function addRemoteDescriptionToPeer({ peerId, sessionDescription }) {
  return (dispatch) => {
    dispatch({ type: ADD_REMOTE_DESCRIPTION_TO_PEER, peerId, sessionDescription })
  }
}

export function broadcastToDataChannel(message) {
  return (dispatch) => {
    dispatch({ type: BROADCAST_TO_DATA_CHANNEL, message })
  }
}

export function onDataChannelMessage(message) {
  return (dispatch) => {
    dispatch({ ...message })
  }
}

export function onDataChannel(peerId) {
  return (dispatch) => {
    dispatch({ type: HAS_DATA_CHANNEL, peerId })
  }
}
