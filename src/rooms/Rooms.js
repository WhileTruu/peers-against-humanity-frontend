import React, { Component, PropTypes as Types } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

import RoomList from './roomList'
import Room from './room'
import AuthOptions from '../user/authOptions'

import { actions as socketActions } from '../common/socket'

class Rooms extends Component {
  componentDidMount() {
    if (this.props.isLoggedIn && !this.props.socket.connected) {
      this.props.connect()
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((!this.props.isLoggedIn && nextProps.isLoggedIn) && !this.props.socket.connected) {
      this.props.connect()
    }
  }

  render() {
    const { isLoggedIn, room, match, socket } = this.props

    const socketState = (() => {
      if (socket.connecting) return { text: 'CONNECTING', textStyle: 'text-info' }
      if (socket.authenticating) return { text: 'AUTHENTICATING', textStyle: 'text-primary' }
      if (socket.connected) return { text: 'CONNECTED', textStyle: 'text-success' }
      return { text: 'DISCONNECTED', textStyle: 'text-danger' }
    })()
    console.log(`SOCKET IS ${socketState.text}`)
    return (
      <div>
        {room && room.id ? <Redirect to={`/rooms/${room.id}`} /> : ''}
        {!isLoggedIn ? <AuthOptions url={match.url} /> : ''}
        {isLoggedIn ?
          <div>
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
  room: Types.shape({}),
  isLoggedIn: Types.bool,
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
  room: null,
  isLoggedIn: false,
}

const mapStoreToProps = store => ({
  isLoggedIn: store.user.isLoggedIn,
  room: store.rooms.room,
  socket: store.socket,
})

const mapDispatchToProps = dispatch => ({
  connect: () => dispatch(socketActions.connect()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Rooms))
