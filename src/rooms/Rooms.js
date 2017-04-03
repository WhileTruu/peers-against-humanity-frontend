import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

import RoomList from './roomList'
import Room from './room'

import WebSocketService from '../services/webSocket'
import { actions as dataChannelActions } from '../services/webRTCDataChannel'
import { actions as roomsActions } from '.'

class Rooms extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token')
    if (token) WebSocketService.open('localhost:8080/api/v1/rooms', token)
  }

  render() {
    const { socketIsOpen, availableRooms, currentRoomId } = this.props
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
              createRoom={this.props.createRoom}
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
  // history: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  //   replace: PropTypes.func.isRequired,
  // }).isRequired,
  // match: PropTypes.shape({
  //   url: PropTypes.string.isRequired,
  // }).isRequired,
  // location: PropTypes.shape({
  //   pathname: PropTypes.string.isRequired,
  // }).isRequired,
}

Rooms.defaultProps = {
  userId: null,
  availableRooms: null,
  currentRoomId: null,
}

const mapStoreToProps = store => ({
  peerConnections: store.dataChannel.peerConnections,
  socketIsOpen: store.socketService.isOpen,
  availableRooms: store.rooms.availableRooms,
  username: store.auth.username,
  userId: store.auth.userId,
  currentRoomId: store.rooms.currentRoomId,
})


const mapDispatchToProps = dispatch => ({
  requestNewPeerConnection: peerId => dispatch(dataChannelActions.requestNewPeerConnection(peerId)),
  createRoom: () => dispatch(roomsActions.createRoom()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Rooms))
