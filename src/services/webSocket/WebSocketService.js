
class WebSocketService {
  constructor() {
    this.webSocket = null
    this.dispatch = null
  }

  close() {
    this.webSocket.close()
    this.webSocket = null
  }

  open(url, token) {
    if (this.webSocket) this.webSocket.close()
    this.webSocket = new WebSocket(`ws://${url}`, token)
  }

  send(data) {
    this.webSocket.send(JSON.stringify(data))
  }
}

const instance = new WebSocketService()

export default instance
