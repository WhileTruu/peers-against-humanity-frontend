export const UPDATE_ROOM = 'UPDATE_ROOM'
export const UPDATE_ROOMS = 'UPDATE_ROOMS'

export function updateRoom(room) {
  return (dispatch) => {
    dispatch({ type: UPDATE_ROOM, room })
  }
}

export function updateRooms(rooms) {
  return { type: UPDATE_ROOMS, rooms }
}
