import {
  ADD_PEER,
  REMOVE_PEER,
  ADD_REMOTE_DESCRIPTION_TO_PEER,
  ADD_ICE_CANDIDATE_TO_PEER,
} from './actions'

const initialState = {
  peerConnections: {},
}

export default function webRTCDataChannel(state = initialState, result) {
  switch (result.type) {
    case ADD_PEER: {
      return {
        peerConnections: {
          ...state.peerConnections,
          [result.peerId]: result.peer,
        },
      }
    }
    case REMOVE_PEER: {
      const { [`${result.peerId}`]: deletedPeer, ...peerConnections } = state.peerConnections
      return {
        peerConnections,
      }
    }
    case ADD_REMOTE_DESCRIPTION_TO_PEER: {
      state.peerConnections[result.peerId].setRemoteDescription(result.sessionDescription)
      return state
    }
    case ADD_ICE_CANDIDATE_TO_PEER: {
      state.peerConnections[result.peerId].addIceCandidate(result.candidate)
      return state
    }
    default:
      return state
  }
}
