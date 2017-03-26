export const OPEN_WEBSOCKET = 'OPEN_WEBSOCKET'
export const CLOSE_WEBSOCKET = 'CLOSE_WEBSOCKET'
export const SOCKET_IS_OPEN = 'SOCKET_IS_OPEN'
export const SOCKET_IS_CLOSED = 'SOCKET_IS_CLOSED'
export const SEND_WEBSOCKET_MESSAGE = 'SEND_WEBSOCKET_MESSAGE'
export const ICE_CANDIDATE = 'ICE_CANDIDATE'

export function connectWebSocket() {
  return (dispatch) => {
    dispatch({ type: OPEN_WEBSOCKET })
  }
}

export function closeSocketConnection() {
  return (dispatch) => {
    dispatch({ type: CLOSE_WEBSOCKET })
  }
}

export function sendWebSocketMessage(data) {
  return (dispatch) => {
    dispatch({ type: SEND_WEBSOCKET_MESSAGE, data })
  }
}

export function socketConnectionIsOpen() {
  return dispatch => (
    dispatch({ type: SOCKET_IS_OPEN })
  )
}

export function socketConnectionIsClosed() {
  return dispatch => (
    dispatch({ type: SOCKET_IS_CLOSED })
  )
}
