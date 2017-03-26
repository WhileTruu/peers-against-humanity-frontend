export const ADD_PEER = 'ADD_PEER'
export const REMOVE_PEER = 'REMOVE_PEER'
export const PEER_CONNECTION_OFFER = 'PEER_CONNECTION_OFFER'
export const PEER_CONNECTION_ANSWER = 'PEER_CONNECTION_ANSWER'
export const ADD_ICE_CANDIDATE_TO_PEER = 'ADD_ICE_CANDIDATE_TO_PEER'
export const REQUEST_NEW_PEER = 'REQUEST_NEW_PEER'
export const ADD_REMOTE_DESCRIPTION_TO_PEER = 'ADD_REMOTE_DESCRIPTION_TO_PEER'

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

export function peerConnectionEstablishmentOffer({ peerId, sessionDescription }) {
  return (dispatch) => {
    dispatch({ type: PEER_CONNECTION_OFFER, peerId, sessionDescription })
  }
}

export function peerConnectionEstablishmentAnswer({ peerId, sessionDescription }) {
  return (dispatch) => {
    dispatch({ type: PEER_CONNECTION_ANSWER, peerId, sessionDescription })
  }
}

export function addICECandidateToPeer({ peerId, candidate }) {
  return (dispatch) => {
    dispatch({ type: ADD_ICE_CANDIDATE_TO_PEER, peerId, candidate })
  }
}

export function requestNewPeerConnection(peerId) {
  return (dispatch) => {
    dispatch({ type: REQUEST_NEW_PEER, peerId })
  }
}

export function addRemoteDescriptionToPeer({ peerId, sessionDescription }) {
  return (dispatch) => {
    dispatch({ type: ADD_REMOTE_DESCRIPTION_TO_PEER, peerId, sessionDescription })
  }
}
