export const SOCKET_CONNECTING = 'SOCKET_CONNECTING'
export const SOCKET_AUTHENTICATING = 'SOCKET_AUTHENTICATING'
export const SOCKET_CONNECTED = 'SOCKET_CONNECTED'
export const SOCKET_DISCONNECTED = 'SOCKET_DISCONNECTED'
export const SOCKET_CONNECT = 'SOCKET_CONNECT'
export const SOCKET_DISCONNECT = 'SOCKET_DISCONNECT'
export const SOCKET_SEND = 'SOCKET_SEND'
export const TAKE_OVER_ROOM = 'TAKE_OVER_ROOM'

export function connecting() {
  return { type: SOCKET_CONNECTING }
}

export function authenticating() {
  return { type: SOCKET_AUTHENTICATING }
}

export function connected() {
  return { type: SOCKET_CONNECTED }
}

export function disconnected() {
  return { type: SOCKET_DISCONNECTED }
}

// The following actions are used by the socket middleware
export function connect() {
  return { type: SOCKET_CONNECT }
}

export function disconnect() {
  return { type: SOCKET_DISCONNECT }
}

export function send(data) {
  return { type: SOCKET_SEND, data: JSON.stringify(data) }
}

export function takeOverRoom() {
  return (dispatch, getState) => {
    dispatch(send({ type: TAKE_OVER_ROOM, id: getState().rooms.room.id }))
  }
}
