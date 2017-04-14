export const UPDATE_LIST_ROOM = 'UPDATE_LIST_ROOM'
export const UPDATE_LIST_ROOMS = 'UPDATE_LIST_ROOMS'

export function updateRoom(room) {
  return { type: UPDATE_LIST_ROOM, room }
}

export function updateRooms(rooms) {
  return { type: UPDATE_LIST_ROOMS, rooms }
}
