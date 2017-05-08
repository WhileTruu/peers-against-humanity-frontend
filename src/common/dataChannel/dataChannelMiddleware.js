import {
  peerConnectionConfig,
  sessionDescriptionProtocolConstraints as sdpConstraints,
} from './config'

import { JOIN, JOINED, OFFER, ANSWER, ICE_CANDIDATE, BROADCAST, EXIT } from './constants'
import { actions as dataChannelActions } from '.'
import { actions as socketActions } from '../socket'
import { actions as chatActions } from '../../chat'
import { actions as roomActions } from '../../rooms/room'

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
      peerConnections[state.room.ownerId] &&
      peerConnections[state.room.ownerId].dataChannel.readyState === 'open'
    ) {
      peerConnections[state.room.ownerId].dataChannel.send(JSON.stringify(message))
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
        if (message.id !== parseInt(id, 10)) {
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
      if (state.user.id === state.room.ownerId) {
        send({ type: JOINED, from: state.user.id, to: id, room: state.room }, store)
        broadcast({ type: JOIN, id })
      }
      store.dispatch(dataChannelActions.hasRTCDataChannel(id))
      event.channel.onmessage = message => onMessage(message, store)  // eslint-disable-line
      event.channel.onclose = () => store.dispatch(dataChannelActions.removeUser(id))  // eslint-disable-line
      event.channel.onerror = console.log  // eslint-disable-line
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
      if (state.user.id !== state.room.ownerId) {
        store.dispatch(socketActions.disconnect())
      }
      store.dispatch(dataChannelActions.hasRTCDataChannel(id))
      event.channel.onmessage = message => onMessage(message, store)  // eslint-disable-line
      event.channel.onclose = () => store.dispatch(dataChannelActions.removeUser(id))  // eslint-disable-line
      event.channel.onerror = console.log  // eslint-disable-line
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
    console.log(id, peerConnections)
    peerConnections[id].rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  }

  const onMessage = (message, store) => {
    const data = JSON.parse(message.data)
    const state = store.getState()
    console.log(data)

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
        console.log('requesting new connection')
        requestNewPeerConnection(data.id, store)
        break

      case JOINED:
        store.dispatch(roomActions.joinedRoom(data.room))
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

      default:
        console.log(data)
        break
    }
  }

  return store => next => (action) => {
    switch (action.type) {
      case EXIT:
        closeAllPeerConnections()
        break

      case JOIN:
        requestNewPeerConnection(action.id, store)
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

      default:
        break
    }
    next(action)
  }
})()

export default dataChannelMiddleware
