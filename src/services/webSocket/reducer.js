import { SOCKET_IS_OPEN, SOCKET_IS_CLOSED, SOCKET_IS_CONNECTING } from './actions'

const initialState = {
  isConnecting: false,
  isOpen: false,
}

export default function socketService(state = initialState, result) {
  switch (result.type) {
    case SOCKET_IS_OPEN:
      return { isConnecting: false, isOpen: true }
    case SOCKET_IS_CLOSED:
      return { isConnecting: false, isOpen: false }
    case SOCKET_IS_CONNECTING: {
      return { isConnecting: true, isOpen: false }
    }
    default:
      return state
  }
}
