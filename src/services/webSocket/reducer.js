import {
  SOCKET_IS_OPEN,
  SOCKET_IS_CLOSED,
} from './actions'

const initialState = {
  isOpen: false,
}

export default function socketService(state = initialState, result) {
  switch (result.type) {
    case SOCKET_IS_OPEN: {
      return {
        isOpen: true,
      }
    }
    case SOCKET_IS_CLOSED: {
      return {
        isOpen: false,
      }
    }
    default:
      return state
  }
}
