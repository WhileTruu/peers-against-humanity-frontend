export const ADD_PEER = 'ADD_PEER'
export const REMOVE_PEER = 'REMOVE_PEER'
export const ADD_ICE_CANDIDATE_TO_PEER = 'ADD_ICE_CANDIDATE_TO_PEER'
export const ADD_REMOTE_DESCRIPTION_TO_PEER = 'ADD_REMOTE_DESCRIPTION_TO_PEER'
export const PEER_CONNECTION_OFFER = 'PEER_CONNECTION_OFFER'
export const PEER_CONNECTION_ANSWER = 'PEER_CONNECTION_ANSWER'
export const BROADCAST_TO_DATA_CHANNEL = 'BROADCAST_TO_DATA_CHANNEL'
export const HAS_DATA_CHANNEL = 'HAS_DATA_CHANNEL'

export function addPeer(peerId, peer) {
  return (dispatch) => {
    dispatch({ type: ADD_PEER, peerId, peer })
  }
}

export function removePeer(peerId) {
  return (dispatch) => {
    dispatch({ type: REMOVE_PEER, peerId })
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
