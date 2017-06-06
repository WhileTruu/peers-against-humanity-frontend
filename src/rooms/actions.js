import { actions as socketActions } from '../common/socket'
import { actions as gameActions } from '../game'
import { actions as chatActions } from '../chat'
import { actions as dataChannelActions } from '../common/dataChannel'
import {
  UPDATE_ROOM,
  UPDATE_ROOMS,
  CREATE_ROOM,
  JOIN_ROOM,
  EXIT_ROOM,
  ROOM_NOT_CREATED,
  ROOM_NOT_JOINED,
  ROOM_NOT_EXITED,
  JOINED_ROOM,
  EXITED_ROOM,
  CREATED_ROOM,
  UPDATE_ROOM_OWNER,
} from './constants'

export function updateRoom(room) {
  return (dispatch) => {
    dispatch({ type: UPDATE_ROOM, room })
  }
}

export function updateRooms(rooms) {
  return { type: UPDATE_ROOMS, rooms }
}

export function createRoom() {
  return (dispatch, getState) => {
    if (getState().rooms.isFetching) {
      throw new Error('Again same problem, pls find out what is wrong')
    } else {
      dispatch({ type: CREATE_ROOM })
      dispatch(socketActions.send({ type: CREATE_ROOM }))
    }
  }
}

export function joinRoom(id) {
  return (dispatch) => {
    dispatch({ type: JOIN_ROOM, id: parseInt(id, 10) })
    dispatch(socketActions.send({ type: JOIN_ROOM, id: parseInt(id, 10) }))
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

export function updateRoomOwner(id, ownerUsername, ownerNickname) {
  return { type: UPDATE_ROOM_OWNER, id, ownerUsername, ownerNickname }
}

export function exitRoom(id) {
  return (dispatch, getState) => {
    // reset the game if needed
    if (getState().game.started) dispatch(gameActions.reset())

    // reset the chat
    dispatch(chatActions.reset())

    // exit the data channel
    dispatch(dataChannelActions.exitChannel())

    // exit the room
    dispatch(exitedRoom())

    // reconnect with the server if needed and say that I exited if I own room.
    if (getState().socket.connected) {
      dispatch(socketActions.send({ type: EXIT_ROOM, id }))
    } else {
      dispatch(socketActions.connect())
    }
  }
}
