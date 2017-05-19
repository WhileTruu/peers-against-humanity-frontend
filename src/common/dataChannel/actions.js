import {
  JOIN,
  OFFER,
  ICE_CANDIDATE,
  ANSWER,
  ADD_USER,
  REMOVE_USER,
  HAS_RTC_DATA_CHANNEL,
  BROADCAST,
  EXIT,
  SEND,
} from './constants'

import { actions as socketActions } from '../socket'
import { actions as gameActions } from '../../game'
import { actions as roomsActions } from '../../rooms'


export function join(id) {
  return { type: JOIN, from: id }
}

export function offer(message) {
  return { type: OFFER, ...message }
}

export function iceCandidate(message) {
  return { type: ICE_CANDIDATE, ...message }
}

export function answer(message) {
  return { type: ANSWER, ...message }
}

export function addUser(id, user) {
  return { type: ADD_USER, id, user }
}

export function removeUser(id) {
  return (dispatch, getState) => {
    const { dataChannel, user, rooms, game } = getState()
    dispatch({ type: REMOVE_USER, id })
    if (game.players && game.players[id]) {
      dispatch(gameActions.playerExited(id))
    }
    if (!dataChannel.users) return
    const smallestMemberId = Object.keys(dataChannel.users)
      .filter(key => dataChannel.users[key].active && dataChannel.users[key].hasRTCDataChannel)
      .map(memberId => parseInt(memberId, 10))
      .concat([user.id])
      .filter(memberId => memberId !== id)
      .reduce((accumulator, current) => (
        accumulator !== null && accumulator < current ? accumulator : current
      ), null)

    if (smallestMemberId && rooms.room.ownerId === id && user.id === smallestMemberId) {
      dispatch(socketActions.connect())
      dispatch(roomsActions.updateRoomOwner(user.id, user.username, user.nickname))
    } else if (rooms.room.ownerId === id && smallestMemberId) {
      dispatch(roomsActions
        .updateRoomOwner(
          smallestMemberId,
          dataChannel.users[smallestMemberId].username,
          dataChannel.users[smallestMemberId].nickname,
        ),
      )
    } else {
      console.log('u fucked up real good bro')
      dispatch(socketActions.connect())
    }
  }
}

export function hasRTCDataChannel(id) {
  return { type: HAS_RTC_DATA_CHANNEL, id }
}

export function broadcast(message) {
  return { type: BROADCAST, message }
}

export function send(message) {
  return { type: SEND, message }
}

export function exitChannel() {
  return { type: EXIT }
}
