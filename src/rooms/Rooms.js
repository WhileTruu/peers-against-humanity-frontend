import React, { Component, PropTypes as Types } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

import RoomList from './roomList'
import Room from './room'
import AuthOptions from '../user/authOptions'

import { actions as socketActions } from '../common/socket'

const socketState = (socket) => {
  if (socket.connecting) return { text: 'connecting...', textStyle: 'text-info' }
  if (socket.authenticating) return { text: 'authenticating...', textStyle: 'text-warn' }
  if (socket.connected) return { text: 'connected', textStyle: 'text-success' }
  return { text: 'disconnected', textStyle: 'text-primary' }
}

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

    return (
      <div>
        {
          socket && (
            <div className="container">
              <h3 className={socketState(socket).textStyle}>
                server is {socketState(socket).text}
              </h3>
            </div>
          )
        }
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
