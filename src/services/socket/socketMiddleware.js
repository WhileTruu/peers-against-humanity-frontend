/* eslint-disable */

import webSocketUrl from './config'
import { actions } from '.'
import {
  SOCKET_CONNECT as CONNECT,
  SOCKET_DISCONNECT as DISCONNECT,
  SOCKET_SEND as SEND,
} from './actions'

import { actions as roomsActions } from '../../rooms'
import { actions as roomActions } from '../../rooms/room'

import DataChannelService from '../webRTCDataChannel'

const roomActionTypes = [
  'UPDATE_ROOMS',
  'UPDATE_ROOM',
  'CREATED_ROOM',
  'EXITED_ROOM',
  'ROOM_NOT_EXITED',
  'ROOM_NOT_JOINED',
  'ROOM_NOT_CREATED',
]

const socketMiddleware = (function(){
  let webSocket = null

  const onOpen = (socket, store) => (event) => {
    console.log(event)
    store.dispatch(actions.send({ type: 'AUTHENTICATE', token: store.getState().users.token }))
    store.dispatch(actions.authenticating())
  }

  const onClose = (socket, store) => (event) => {
    console.log(event)
    store.dispatch(actions.disconnected())
  }

  const onMessage = (socket, store) => (event) => {
    const message = JSON.parse(event.data)
    if (roomActionTypes.includes(message.type)) {
      store.dispatch(message)
      return
    }
    switch (message.type) {

      case 'AUTHENTICATED':
        store.dispatch(actions.connected())
        break

      default:
        DataChannelService.onDataChannelMessage(message)
        break
    }
  }

  return store => next => (action) => {
    switch (action.type) {

      case CONNECT:
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
    }
  }
})()

export default socketMiddleware
