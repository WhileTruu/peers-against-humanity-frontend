import webSocketUrl from './config'
import { actions } from '.'
import {
  CONNECT,
  DISCONNECT,
  SEND,
} from './constants'

import { actions as roomsActions } from '../../rooms'
import { actions as dataChannelActions } from '../dataChannel'

const roomActionTypes = [
  '@rooms/UPDATE_ROOMS',
  '@rooms/UPDATE_ROOM',
  '@rooms/CREATED_ROOM',
  '@rooms/EXITED_ROOM',
  '@rooms/ROOM_NOT_EXITED',
  '@rooms/ROOM_NOT_JOINED',
  '@rooms/ROOM_NOT_CREATED',
]

const socketMiddleware = (() => {
  let webSocket = null

  const onOpen = (socket, store) => (event) => { // eslint-disable-line
    store.dispatch(actions.send({ type: '@socket/AUTHENTICATE', token: store.getState().user.token }))
    store.dispatch(actions.authenticating())
  }

  const onClose = (socket, store) => (event) => { // eslint-disable-line
    store.dispatch(actions.disconnected())
  }

  const onMessage = (socket, store) => (event) => {
    const state = store.getState()
    const { rooms, user } = state
    const { room } = rooms
    const message = JSON.parse(event.data)
    switch (message.type) {

      case '@socket/AUTHENTICATED': {
        store.dispatch(actions.connected())
        break
      }

      case '@rooms/CREATED_ROOM':
        store.dispatch(roomsActions.createdRoom(message.room))
        break

      case '@rooms/JOIN_ROOM':
        store.dispatch(dataChannelActions.join(message.from))
        break

      case '@rooms/JOIN_DENIED':
        store.dispatch(roomsActions.roomNotJoined())
        break

      case '@dataChannel/OFFER':
        store.dispatch(dataChannelActions.offer(message))
        break

      case '@dataChannel/ANSWER':
        store.dispatch(dataChannelActions.answer(message))
        break

      case '@dataChannel/ICE_CANDIDATE':
        store.dispatch(dataChannelActions.iceCandidate(message))
        break

      case '@rooms/UPDATE_ROOM': {
        store.dispatch(roomsActions.updateRoom(message.room))
        const messageRoom = (room && room.id && message.room.id === room.id) && message.room
        if (
          (room && room.ownerId === user.id) &&
          (room.ownerId !== messageRoom.ownerId && !messageRoom.active)
        ) {
          store.dispatch(actions.takeOverRoom())
        }
        // if (state.user.id === message.room.ownerId) {
        //   store.dispatch(dataChannelActions.broadcast(message))
        // }
        break
      }

      case '@rooms/UPDATE_ROOMS': {
        store.dispatch(roomsActions.updateRooms(message.rooms))
        const messageRoom = (room && room.id && message.rooms) && message.rooms[room.id]
        if (
          (room && room.ownerId === user.id) &&
          (
            (message.rooms === null) ||
            (room.ownerId !== messageRoom.ownerId && !messageRoom.active)
          )
        ) {
          store.dispatch(actions.takeOverRoom())
        }
        break
      }

      default:
        if (roomActionTypes.includes(message.type)) {
          store.dispatch(message)
        }
        break
    }
  }

  return store => next => (action) => {
    switch (action.type) {

      case CONNECT:
        if (store.getState().socket.connecting) return
        if (webSocket !== null) webSocket.close()
        store.dispatch(actions.connecting())

        webSocket = new WebSocket(webSocketUrl)
        webSocket.onopen = onOpen(webSocket, store)
        webSocket.onclose = onClose(webSocket, store)
        webSocket.onmessage = onMessage(webSocket, store)
        break

      case DISCONNECT:
        if (webSocket !== null) {
          webSocket.close()
          webSocket = null
        }
        break

      case SEND:
        if (webSocket) webSocket.send(action.data)
        break

      default:
        break
    }
    next(action)
  }
})()

export default socketMiddleware
