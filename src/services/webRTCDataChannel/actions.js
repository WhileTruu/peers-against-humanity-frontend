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

export function onMessage(message) {
  return (dispatch) => {
    dispatch({ ...message })
  }
}
