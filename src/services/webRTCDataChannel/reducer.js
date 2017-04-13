import {
  ADD_PEER,
  REMOVE_PEER,
  ADD_REMOTE_DESCRIPTION_TO_PEER,
  ADD_ICE_CANDIDATE_TO_PEER,
  BROADCAST_TO_DATA_CHANNEL,
  HAS_DATA_CHANNEL,
} from './actions'

const initialState = {
  peerConnections: null,
}

export default function dataChannel(state = initialState, result) {
  switch (result.type) {
    case ADD_PEER: {
      return {
        ...state,
        peerConnections: {
          ...state.peerConnections,
          [result.peerId]: result.peer,
        },
      }
    }
    case REMOVE_PEER: {
      const { [`${result.peerId}`]: deletedPeer, ...peerConnections } = state.peerConnections
      return {
        ...state,
        peerConnections,
      }
    }
    case ADD_REMOTE_DESCRIPTION_TO_PEER: {
      state.peerConnections[result.peerId].setRemoteDescription(result.sessionDescription)
      return { ...state }
    }
    case ADD_ICE_CANDIDATE_TO_PEER: {
      state.peerConnections[result.peerId].addIceCandidate(result.candidate)
      return { ...state }
    }
    case BROADCAST_TO_DATA_CHANNEL: {
      if (state.peerConnections) {
        Object.keys(state.peerConnections).forEach((key) => {
          state.peerConnections[key].send(result.message)
        })
      }
      return { ...state }
    }
    case HAS_DATA_CHANNEL: {
      return {
        peerConnections: {
          ...state.peerConnections,
          [result.peerId]: {
            hasDataChannel: true,
            ...state.peerConnections[result.peerId],
          },
        },
      }
    }
    default:
      return state
  }
}
