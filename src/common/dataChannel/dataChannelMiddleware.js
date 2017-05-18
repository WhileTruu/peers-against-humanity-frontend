import {
  peerConnectionConfig,
  sessionDescriptionProtocolConstraints as sdpConstraints,
} from './config'

import { JOIN, JOINED, OFFER, ANSWER, ICE_CANDIDATE, BROADCAST, EXIT, SEND } from './constants'
import { PLAYER_READY } from '../../game/constants'

import { actions as dataChannelActions } from '.'
import { actions as socketActions } from '../socket'
import { actions as chatActions } from '../../chat'
import { actions as gameActions } from '../../game'
import { actions as roomsActions } from '../../rooms'

const dataChannelMiddleware = (() => {
  const peerConnections = {}

  const send = (message, store) => {
    const state = store.getState()
    if (
      peerConnections[message.to] &&
      peerConnections[message.to].dataChannel.readyState === 'open'
    ) {
      peerConnections[message.to].dataChannel.send(JSON.stringify(message))
    } else if (
      state.rooms.room &&
      peerConnections[state.rooms.room.ownerId] &&
      peerConnections[state.rooms.room.ownerId].dataChannel.readyState === 'open'
    ) {
      peerConnections[state.rooms.room.ownerId].dataChannel.send(JSON.stringify(message))
    } else {
      store.dispatch(socketActions.send(message))
    }
  }

  const closeAllPeerConnections = () => {
    Object.keys(peerConnections)
      .forEach((id) => {
        if (peerConnections[id].rtcPeerConnection.signalingState === 'closed') return
        peerConnections[id].rtcPeerConnection.close()
      })
  }

  const broadcast = (message) => {
    Object.keys(peerConnections).forEach((id) => {
      if (peerConnections[id].dataChannel.readyState === 'open') {
        if (message.from !== parseInt(id, 10)) {
          peerConnections[id].dataChannel.send(JSON.stringify(message))
        }
      }
    })
  }

  const requestNewPeerConnection = (id, store) => {
    const state = store.getState()
    const rtcPeerConnection = new RTCPeerConnection(peerConnectionConfig)
    const dataChannel = rtcPeerConnection.createDataChannel('datachannel', { reliable: true })
    rtcPeerConnection.onicecandidate = event => event.candidate && (
      send({ type: ICE_CANDIDATE, from: state.user.id, to: id, candidate: event.candidate }, store)
    )
    rtcPeerConnection.ondatachannel = (event) => {
      if (state.user.id === state.rooms.room.ownerId) {
        send({ type: JOINED, from: state.user.id, to: id, room: state.rooms.room }, store)
        if (
          state.game.players &&
          Object.keys(state.game.players).map(key => parseInt(key, 10)).includes(id)
        ) {
          store.dispatch(gameActions.joinGame(id))
        }
        broadcast({ type: JOIN, from: id })
      }
      store.dispatch(dataChannelActions.hasRTCDataChannel(id))
      event.channel.onmessage = message => onMessage(message, store)  // eslint-disable-line
      event.channel.onclose = () => store.dispatch(dataChannelActions.removeUser(id))  // eslint-disable-line
      event.channel.onerror = console.log  // eslint-disable-line
    }
    rtcPeerConnection.oniceconnectionstatechange = () => {
      if (rtcPeerConnection.iceConnectionState === 'disconnected') {
        store.dispatch(dataChannelActions.removeUser(id))
      }
    }
    rtcPeerConnection.createOffer(sdpConstraints)
      .then((localSessionDescription) => {
        rtcPeerConnection.setLocalDescription(localSessionDescription)
        send({
          type: OFFER,
          from: state.user.id,
          to: id,
          user: { nickname: state.user.nickname, username: state.user.username, id: state.user.id },
          sessionDescription: localSessionDescription,
        }, store)
      })
    peerConnections[id] = { rtcPeerConnection, dataChannel }
  }

  const onPeerConnectionOffer = (id, sessionDescription, store) => {
    const state = store.getState()
    const rtcPeerConnection = new RTCPeerConnection(peerConnectionConfig)
    const dataChannel = rtcPeerConnection.createDataChannel('datachannel', { reliable: true })
    rtcPeerConnection.onicecandidate = event => event.candidate && (
      send({ type: ICE_CANDIDATE, from: state.user.id, to: id, candidate: event.candidate }, store)
    )
    rtcPeerConnection.ondatachannel = (event) => {
      // if (state.user.id !== state.rooms.room.ownerId) {
      //   store.dispatch(socketActions.disconnect())
      // }
      if (
        state.game.players &&
        Object.keys(state.game.players).map(key => parseInt(key, 10)).includes(id)
      ) {
        store.dispatch(dataChannelActions.broadcast({ type: PLAYER_READY, from: state.user.id }))
      }

      store.dispatch(dataChannelActions.hasRTCDataChannel(id))
      event.channel.onmessage = message => onMessage(message, store)  // eslint-disable-line
      event.channel.onclose = () => { // eslint-disable-line
        store.dispatch(dataChannelActions.removeUser(id))  // eslint-disable-line
      }
      event.channel.onerror = console.log  // eslint-disable-line
    }
    rtcPeerConnection.oniceconnectionstatechange = () => {
      if (rtcPeerConnection.iceConnectionState === 'disconnected') {
        store.dispatch(dataChannelActions.removeUser(id))
      }
    }
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(sessionDescription))
    rtcPeerConnection.createAnswer(sdpConstraints)
      .then((localSessionDescription) => {
        rtcPeerConnection.setLocalDescription(localSessionDescription)
        send({
          type: ANSWER,
          from: state.user.id,
          to: id,
          user: { nickname: state.user.nickname, username: state.user.username, id: state.user.id },
          sessionDescription: localSessionDescription,
        }, store)
      })
    peerConnections[id] = { rtcPeerConnection, dataChannel }
  }

  const onPeerConnectionAnswer = (id, sessionDescription) => {
    peerConnections[id].rtcPeerConnection.setRemoteDescription(sessionDescription)
  }

  const addIceCandidate = (id, candidate) => {
    peerConnections[id].rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  }

  const onMessage = (message, store) => {
    const data = JSON.parse(message.data)
    const state = store.getState()
    // console.log(message.data, (new TextEncoder('utf-8').encode(message.data)).length)

    if (data.to && data.to !== state.user.id) {
      send(data, store)
      return
    }

    switch (data.type) {
      case '@chat/MESSAGE':
        store.dispatch(chatActions.message(data.data))
        break

      case '@dataChannel/ICE_CANDIDATE':
        addIceCandidate(data.from, data.candidate)
        break

      case JOIN:
        requestNewPeerConnection(data.from, store)
        break

      case JOINED:
        store.dispatch(roomsActions.joinedRoom(data.room))
        break

      case OFFER:
        store.dispatch(dataChannelActions.addUser(data.from, data.user))
        onPeerConnectionOffer(data.from, data.sessionDescription, store)
        break

      case ANSWER:
        store.dispatch(dataChannelActions.addUser(data.from, data.user))
        onPeerConnectionAnswer(data.from, data.sessionDescription)
        break

      case ICE_CANDIDATE:
        addIceCandidate(data.from, data.candidate)
        break

      case '@game/INITIALIZE_GAME': {
        store.dispatch(gameActions.startGameMessage(data))
        break
      }
      case '@game/START_ROUND': {
        store.dispatch(data)
        break
      }
      case '@game/PLAYER_READY': {
        store.dispatch(gameActions.readyCheck(data.from))
        break
      }
      case '@game/SUBMIT_CARDS': {
        store.dispatch(data)
        break
      }
      case '@game/BEST_SUBMISSION': {
        store.dispatch(data)
        break
      }

      default:
        console.warn(data)
        break
    }
  }

  return store => next => (action) => {
    switch (action.type) {
      case EXIT:
        closeAllPeerConnections()
        break

      case JOIN:
        requestNewPeerConnection(action.from, store)
        break

      case OFFER:
        store.dispatch(dataChannelActions.addUser(action.from, action.user))
        onPeerConnectionOffer(action.from, action.sessionDescription, store)
        break

      case ANSWER:
        store.dispatch(dataChannelActions.addUser(action.from, action.user))
        onPeerConnectionAnswer(action.from, action.sessionDescription)
        break

      case ICE_CANDIDATE:
        addIceCandidate(action.from, action.candidate)
        break

      case BROADCAST:
        broadcast(action.message)
        break

      case SEND:
        send(action.message, store)
        break

      default:
        break
    }
    next(action)
  }
})()

export default dataChannelMiddleware
