import {
  ADD_PEER,
  REMOVE_PEER,
  CONNECTED,
} from './actions'

const initialState = {
  peers: null,
}

const initialPeer = {
  id: null,
  connected: false,
  negotiating: false,
}

export default function dataChannel(state = initialState, result) {
  switch (result.type) {
    case ADD_PEER: {
      if (state.peers && Object.keys(state.peers).includes(result.id.toString())) return state
      return {
        ...state,
        peers: {
          ...state.peers,
          [result.id]: { ...initialPeer, id: result.id, negotiating: true },
        },
      }
    }
    case REMOVE_PEER: {
      const { [`${result.id}`]: deletedPeer, ...peers } = state.peers
      return { ...state, peers }
    }
    case CONNECTED: {
      return {
        ...state,
        peers: {
          ...state.peers,
          [`${result.id}`]: {
            ...state.peers[`${result.id}`],
            connected: true,
            negotiating: false,
          },
        },
      }
    }
    default:
      return state
  }
}
