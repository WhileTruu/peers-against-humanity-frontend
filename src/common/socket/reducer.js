import {
  CONNECTING,
  AUTHENTICATING,
  CONNECTED,
  DISCONNECTED,
} from './constants'

const initialState = { connected: false, authenticating: false, connecting: false }

export default function socket(state = initialState, result) {
  switch (result.type) {

    case CONNECTING:
      return { ...initialState, connecting: true }

    case AUTHENTICATING:
      return { ...initialState, authenticating: true }

    case CONNECTED:
      return { ...initialState, connected: true }

    case DISCONNECTED:
      return initialState

    default:
      return state
  }
}
