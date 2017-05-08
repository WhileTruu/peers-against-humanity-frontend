import { actions as socketActions } from '../../common/socket'
import { actions as gameActions } from '../../game'
import { actions as dataChannelActions } from '../../common/dataChannel'

export const ADD_MEMBER = 'ADD_MEMBER'
export const REMOVE_MEMBER = 'REMOVE_MEMBER'
export const HAS_DATA_CHANNEL = 'HAS_DATA_CHANNEL'

export const CREATE_ROOM = 'CREATE_ROOM'
export const JOIN_ROOM = 'JOIN_ROOM'
export const EXIT_ROOM = 'EXIT_ROOM'
export const ROOM_NOT_CREATED = 'ROOM_NOT_CREATED'
export const ROOM_NOT_JOINED = 'ROOM_NOT_JOINED'
export const ROOM_NOT_EXITED = 'ROOM_NOT_EXITED'
export const JOINED_ROOM = 'JOINED_ROOM'
export const EXITED_ROOM = 'EXITED_ROOM'
export const CREATED_ROOM = 'CREATED_ROOM'

export const roomActionTypes = [
  'CREATE_ROOM',
  'JOIN_ROOM',
  'EXIT_ROOM',
  'ROOM_NOT_CREATED',
  'ROOM_NOT_JOINED',
  'ROOM_NOT_EXITED',
  'JOINED_ROOM',
  'EXITED_ROOM',
  'CREATED_ROOM',
]

export function addMember(member) {
  return { type: ADD_MEMBER, member }
}

export function removeMember(id) {
  return (dispatch, getState) => {
    const { room, user } = getState()
    dispatch({ type: REMOVE_MEMBER, id })
    const smallestMemberId = Object.keys(room.members)
      .map(memberId => parseInt(memberId, 10))
      .filter(memberId => memberId !== id)
      .reduce((accumulator, current) => (
        accumulator !== null && accumulator < current ? accumulator : current
      ), null)

    if (room.ownerId === id && (user.id < smallestMemberId || smallestMemberId === null)) {
      dispatch(socketActions.connect())
    }
  }
}

export function hasDataChannel(id) {
  return (dispatch, getState) => {
    dispatch({ type: HAS_DATA_CHANNEL, id })
    if (getState().game.started) dispatch(gameActions.joinGame(id))
  }
}

export function createRoom() {
  return (dispatch, getState) => {
    if (getState().room.isFetching) {
      throw new Error('Again same problem, pls find out what is wrong')
    } else {
      dispatch({ type: CREATE_ROOM })
      dispatch(addMember(getState().user))
      dispatch(socketActions.send({ type: CREATE_ROOM }))
    }
  }
}

export function joinRoom(id) {
  return (dispatch, getState) => {
    dispatch(addMember(getState().user))
    dispatch({ type: JOIN_ROOM, id: parseInt(id, 10) })
    dispatch(socketActions.send({ type: JOIN_ROOM, id: parseInt(id, 10) }))
  }
}

export function exitRoom(id) {
  return (dispatch, getState) => {
    if (getState().game.started) dispatch(gameActions.exitGame())
    dispatch(dataChannelActions.exitChannel())
    dispatch({ type: EXITED_ROOM, id })
    if (getState().socket.connected) {
      dispatch(socketActions.send({ type: EXIT_ROOM, id }))
    } else {
      dispatch(socketActions.connect())
    }
  }
}

export function createdRoom(room) {
  return { type: CREATED_ROOM, room }
}

export function joinedRoom(room) {
  return (dispatch) => {
    dispatch(socketActions.disconnect())
    dispatch({ type: JOINED_ROOM, room })
  }
}

export function exitedRoom() {
  return { type: EXITED_ROOM }
}

export function roomNotCreated() {
  return { type: ROOM_NOT_CREATED }
}

export function roomNotJoined() {
  return { type: ROOM_NOT_JOINED }
}

export function roomNotExited() {
  return { type: ROOM_NOT_EXITED }
}
