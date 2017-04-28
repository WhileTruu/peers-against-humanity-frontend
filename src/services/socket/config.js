const isDevEnv = process.env.NODE_ENV === 'development'
const webSocketUrl = `${isDevEnv ? 'ws' : 'wss'}://${window.location.host}/api/v1/rooms`

export default webSocketUrl
