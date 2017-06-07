import React, { PropTypes as Types } from 'react'
import { connect } from 'react-redux'

const socketState = (socket) => {
  if (socket.connecting) return { text: 'connecting...', textStyle: 'text-info' }
  if (socket.authenticating) return { text: 'authenticating...', textStyle: 'text-warn' }
  if (socket.connected) return { text: 'connected', textStyle: 'text-success' }
  return { text: 'disconnected', textStyle: 'text-primary' }
}

const SocketState = ({ socket }) => (
  <div>
    {
      socket && (
        <h3 className={socketState(socket).textStyle}>
          server is {socketState(socket).text}
        </h3>
      )
    }
  </div>
)

SocketState.propTypes = { socket: Types.shape({}).isRequired }

const mapStoreToProps = store => ({ socket: store.socket })

export default connect(mapStoreToProps)(SocketState)
