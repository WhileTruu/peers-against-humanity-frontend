import React, { Component, PropTypes as Types } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

import RoomList from './roomList'
import Room from './room'
import AuthOptions from '../users/authOptions'

import { actions as socketActions } from '../services/socket'

class Rooms extends Component {
  componentDidMount() {
    if (this.props.isAuthenticated && !this.props.socket.connected) {
      this.props.connect()
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((!this.props.isAuthenticated && nextProps.isAuthenticated)
      && !this.props.socket.connected
    ) {
      this.props.connect()
    }
  }

  render() {
    const { isAuthenticated, currentRoomId, match, socket } = this.props

    const socketState = (() => {
      if (socket.connecting) return { text: 'CONNECTING', textStyle: 'text-info' }
      if (socket.authenticating) return { text: 'AUTHENTICATING', textStyle: 'text-primary' }
      if (socket.connected) return { text: 'CONNECTED', textStyle: 'text-success' }
      return { text: 'DISCONNECTED', textStyle: 'text-danger' }
    })()

    return (
      <div>
        {currentRoomId ? <Redirect to={`/rooms/${currentRoomId}`} /> : ''}
        {!isAuthenticated ? <AuthOptions url={match.url} /> : ''}
        {isAuthenticated ?
          <div>
            <h3
              className={`${socketState.textStyle}`}
            >
              SOCKET IS {socketState.text}
            </h3>
            <Route exact path="/rooms" component={RoomList} />
            <Route path="/rooms/:roomId" component={Room} />
          </div>
        : ''}
      </div>
    )
  }
}

Rooms.propTypes = {
  connect: Types.func.isRequired,
  currentRoomId: Types.number,
  isAuthenticated: Types.bool.isRequired,
  match: Types.shape({
    url: Types.string.isRequired,
  }).isRequired,
  socket: Types.shape({
    connecting: Types.bool.isRequired,
    authenticating: Types.bool.isRequired,
    connected: Types.bool.isRequired,
  }).isRequired,
}

Rooms.defaultProps = {
  currentRoomId: null,
}

const mapStoreToProps = store => ({
  isAuthenticated: store.users.isAuthenticated,
  currentRoomId: store.room.id,
  socket: store.socket,
})

const mapDispatchToProps = dispatch => ({
  connect: () => dispatch(socketActions.connect()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Rooms))
