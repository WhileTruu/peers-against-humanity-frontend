export const OPEN_WEBSOCKET = 'OPEN_WEBSOCKET'
export const CLOSE_WEBSOCKET = 'CLOSE_WEBSOCKET'
export const SOCKET_IS_OPEN = 'SOCKET_IS_OPEN'
export const SOCKET_IS_CLOSED = 'SOCKET_IS_CLOSED'
export const SEND_WEBSOCKET_MESSAGE = 'SEND_WEBSOCKET_MESSAGE'
export const ICE_CANDIDATE = 'ICE_CANDIDATE'
export const SOCKET_CREATE_ROOM = 'SOCKET_CREATE_ROOM'
export const SOCKET_JOIN_ROOM = 'SOCKET_JOIN_ROOM'
export const SOCKET_UPDATE_ROOM = 'SOCKET_UPDATE_ROOM'
export const SOCKET_UPDATE_AVAILABLE_ROOMS = 'SOCKET_UPDATE_AVAILABLE_ROOMS'


export function connectWebSocket(url, token) {
  return (dispatch) => {
    dispatch({ type: OPEN_WEBSOCKET, url, token })
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

export function createRoom(userId, username) {
  return dispatch => (
    dispatch({ type: SOCKET_CREATE_ROOM, userId, username })
  )
}

export function joinRoom(userId, username) {
  return dispatch => (
    dispatch({ type: SOCKET_JOIN_ROOM, userId, username })
  )
}

export function updateRoom(room) {
  return dispatch => (
    dispatch({ type: SOCKET_UPDATE_ROOM, room })
  )
}

export function updateAvailableRooms(availableRooms) {
  return dispatch => (
    dispatch({ type: SOCKET_UPDATE_AVAILABLE_ROOMS, availableRooms })
  )
}
