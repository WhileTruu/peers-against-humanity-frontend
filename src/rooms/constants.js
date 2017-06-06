const withPrefix = name => `@rooms/${name}`

export const UPDATE_ROOM = withPrefix('UPDATE_ROOM')
export const UPDATE_ROOMS = withPrefix('UPDATE_ROOMS')
export const CREATE_ROOM = withPrefix('CREATE_ROOM')
export const JOIN_ROOM = withPrefix('JOIN_ROOM')
export const EXIT_ROOM = withPrefix('EXIT_ROOM')
export const ROOM_NOT_CREATED = withPrefix('ROOM_NOT_CREATED')
export const ROOM_NOT_JOINED = withPrefix('ROOM_NOT_JOINED')
export const ROOM_NOT_EXITED = withPrefix('ROOM_NOT_EXITED')
export const JOINED_ROOM = withPrefix('JOINED_ROOM')
export const EXITED_ROOM = withPrefix('EXITED_ROOM')
export const CREATED_ROOM = withPrefix('CREATED_ROOM')
export const UPDATE_ROOM_OWNER = withPrefix('UPDATE_ROOM_OWNER')
