import webSocketUrl from './config'
import { actions } from '.'
import {
  SOCKET_CONNECT as CONNECT,
  SOCKET_DISCONNECT as DISCONNECT,
  SOCKET_SEND as SEND,
} from './actions'

import { actions as roomActions } from '../../rooms/room'

import DataChannelService from '../RTCDataChannel'

const roomActionTypes = [
  'UPDATE_ROOMS',
  'UPDATE_ROOM',
  'CREATED_ROOM',
  'EXITED_ROOM',
  'ROOM_NOT_EXITED',
  'ROOM_NOT_JOINED',
  'ROOM_NOT_CREATED',
]

const socketMiddleware = (() => {
  let webSocket = null

  const onOpen = (socket, store) => (event) => { // eslint-disable-line
    store.dispatch(actions.send({ type: 'AUTHENTICATE', token: store.getState().user.token }))
    store.dispatch(actions.authenticating())
  }

  const onClose = (socket, store) => (event) => { // eslint-disable-line
    store.dispatch(actions.disconnected())
  }

  const onMessage = (socket, store) => (event) => {
    const message = JSON.parse(event.data)
    switch (message.type) {

      case 'AUTHENTICATED':
        store.dispatch(actions.connected())
        break

      case 'CREATED_ROOM':
        store.dispatch(roomActions.createdRoom(message.room))
        break

      default:
        if (roomActionTypes.includes(message.type)) {
          store.dispatch(message)
        } else {
          DataChannelService.onDataChannelMessage(message)
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
        next(action)
        break
    }
  }
})()

export default socketMiddleware