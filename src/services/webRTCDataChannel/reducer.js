import { ADD_PEER, REMOVE_PEER } from './actions'

const initialState = {
  peerConnections: {},
}

export default function webRTCDataChannel(state = initialState, result) {
  switch (result.type) {
    case ADD_PEER: {
      return {
        ...state,
        [result.peerId]: result.peer,
      }
    }
    case REMOVE_PEER: {
      const { [result.peerId]: deletedPeer, ...peerConnections } = state
      return peerConnections
    }
    default:
      return state
  }
}
