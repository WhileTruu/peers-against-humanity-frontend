export const ADD_PEER = 'ADD_PEER'
export const REMOVE_PEER = 'REMOVE_PEER'

export function isAuthenticated(peerId, peer) {
  return (dispatch) => {
    dispatch({ type: ADD_PEER, peerId, peer })
  }
}

export function isNotAuthenticated(peerId) {
  return (dispatch) => {
    dispatch({ type: REMOVE_PEER, peerId })
  }
}
