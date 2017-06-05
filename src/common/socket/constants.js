const withPrefix = name => `@socket/${name}`

export const CONNECTING = withPrefix('CONNECTING')
export const AUTHENTICATING = withPrefix('AUTHENTICATING')
export const CONNECTED = withPrefix('CONNECTED')
export const DISCONNECTED = withPrefix('DISCONNECTED')
export const CONNECT = withPrefix('CONNECT')
export const DISCONNECT = withPrefix('DISCONNECT')
export const SEND = withPrefix('SEND')
export const TAKE_OVER_ROOM = withPrefix('TAKE_OVER_ROOM')
