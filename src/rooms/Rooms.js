import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

import RoomList from './roomList'
import Room from './room'

import WebSocketService from '../services/webSocket'
import { actions as roomsActions } from '.'

class Rooms extends Component {
  componentDidMount() {
    if (this.props.isAuthenticated) {
      WebSocketService.open('localhost:8080/api/v1/rooms', this.props.token)
    }
  }

  render() {
    const { socketIsOpen, availableRooms, currentRoomId, token } = this.props
    return (
      <div>
        {currentRoomId ? <Redirect to={`/rooms/${currentRoomId}`} /> : ''}
        <Route
          exact path="/rooms"
          component={() => (
            <RoomList
              socketIsOpen={socketIsOpen}
              currentRoomId={currentRoomId}
              rooms={availableRooms}
              createRoom={() => this.props.createRoom(token)}
            />
          )}
        />
        <Route path="/rooms/:roomId" component={Room} />
      </div>
    )
  }
}

Rooms.propTypes = {
  socketIsOpen: PropTypes.bool.isRequired,
  currentRoomId: PropTypes.number,
  availableRooms: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  createRoom: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  token: PropTypes.string,
}

Rooms.defaultProps = {
  userId: null,
  availableRooms: null,
  currentRoomId: null,
  token: null,
}

const mapStoreToProps = store => ({
  isAuthenticated: store.users.isAuthenticated,
  token: store.users.user.token,
  peerConnections: store.dataChannel.peerConnections,
  socketIsOpen: store.socketService.isOpen,
  availableRooms: store.rooms.availableRooms,
  username: store.users.user.username,
  userId: store.users.user.userId,
  currentRoomId: store.rooms.currentRoomId,
})


const mapDispatchToProps = dispatch => ({
  createRoom: token => dispatch(roomsActions.createRoom(token)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Rooms))
