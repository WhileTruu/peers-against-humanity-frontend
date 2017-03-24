import { NEW_ROOM, REMOVE_ROOM } from './actions'

const initialState = {
  rooms: {},
}

export default function webSocketService(state = initialState, result) {
  switch (result.type) {
    case NEW_ROOM: {
      return {
        rooms: {
          [result.peerId]: result.peer,
          ...state,
        },
        ...state,
      }
    }
    case REMOVE_ROOM: {
      const { [result.roomId]: deletedRoom, ...rooms } = state
      return {
        rooms,
        ...state,
      }
    }
    default:
      return state
  }
}
