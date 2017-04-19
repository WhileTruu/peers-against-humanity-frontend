
class WebSocketService {
  constructor() {
    this.webSocket = null
    this.dispatch = null
  }

  close() {
    this.webSocket.close()
    this.webSocket = null
  }

  open(token) {
    if (this.webSocket) this.webSocket.close()
    this.webSocket = new WebSocket(`wss://${window.location.host}/api/v1/rooms`, token)
  }

  send(data) {
    this.webSocket.send(JSON.stringify(data))
  }
}

const instance = new WebSocketService()

export default instance
