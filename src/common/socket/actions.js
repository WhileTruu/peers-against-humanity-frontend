import {
  CONNECTING,
  AUTHENTICATING,
  CONNECTED,
  DISCONNECTED,
  CONNECT,
  DISCONNECT,
  SEND,
  TAKE_OVER_ROOM,
} from './constants'

export function connecting() {
  return { type: CONNECTING }
}

export function authenticating() {
  return { type: AUTHENTICATING }
}

export function connected() {
  return { type: CONNECTED }
}

export function disconnected() {
  return { type: DISCONNECTED }
}

// The following actions are used by the socket middleware
export function connect() {
  return { type: CONNECT }
}

export function disconnect() {
  return { type: DISCONNECT }
}

export function send(data) {
  return { type: SEND, data: JSON.stringify(data) }
}

export function takeOverRoom() {
  return (dispatch, getState) => {
    dispatch(send({ type: TAKE_OVER_ROOM, id: getState().rooms.room.id }))
  }
}
