import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

import RoomList from './roomList'

import { actions as socketActions } from '../services/webSocket'
import Room, { actions as roomActions } from './room'
import AuthOptions from '../users/authOptions'

class Rooms extends Component {
  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.connect(this.props.token)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isAuthenticated && nextProps.isAuthenticated) {
      this.props.connect(nextProps.token)
    }
  }

  render() {
    const {
      isAuthenticated,
      socketIsOpen,
      rooms,
      currentRoomId,
      token,
      match,
    } = this.props
    return (
      <div>
        {currentRoomId ? <Redirect to={`/rooms/${currentRoomId}`} /> : ''}
        {!isAuthenticated ? <AuthOptions url={match.url} /> : ''}
        {isAuthenticated ?
          <div>
            <Route
              exact path="/rooms"
              component={() => (
                <RoomList
                  socketIsOpen={socketIsOpen}
                  currentRoomId={currentRoomId}
                  rooms={rooms}
                  createRoom={() => this.props.createRoom(token)}
                />
              )}
            />
            <Route path="/rooms/:roomId" component={Room} />
          </div>
        : ''}
      </div>
    )
  }
}

Rooms.propTypes = {
  connect: PropTypes.func.isRequired,
  socketIsOpen: PropTypes.bool.isRequired,
  currentRoomId: PropTypes.number,
  rooms: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  createRoom: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  token: PropTypes.string,
}

Rooms.defaultProps = {
  rooms: null,
  currentRoomId: null,
  token: null,
}

const mapStoreToProps = store => ({
  isAuthenticated: store.users.isAuthenticated,
  peerConnections: store.dataChannel.peerConnections,
  socketIsOpen: store.socketService.isOpen,
  rooms: store.rooms.rooms,
  currentRoomId: store.room.id,
  token: store.users.token,
})


const mapDispatchToProps = dispatch => ({
  createRoom: token => dispatch(roomActions.createRoom(token)),
  connect: token => dispatch(socketActions.connect(token)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Rooms))
