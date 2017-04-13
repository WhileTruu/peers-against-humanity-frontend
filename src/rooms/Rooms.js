import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

import RoomList from './roomList'
import Room from './room'

import { Authentication } from '../users'

import { actions as socketActions } from '../services/webSocket'
import { actions as roomsActions } from '.'

const loginModal = ({ url }) => (
  <div className="row">
    <div className="col-12" style={{ position: 'absolute', zIndex: 2 }}>
      <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <div className="card-block">
          <Authentication onSuccessRedirectTo={url} />
        </div>
      </div>
    </div>
  </div>
)

loginModal.propTypes = {
  url: PropTypes.string.isRequired,
}

class Rooms extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.props.isAuthenticated && nextProps.isAuthenticated) {
      this.props.connect('localhost:8080/api/v1/rooms', nextProps.token)
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
        {!isAuthenticated ? loginModal({ url: match.url }) : ''}
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
  token: PropTypes.string,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
}

Rooms.defaultProps = {
  userId: null,
  rooms: null,
  currentRoomId: null,
  token: null,
}

const mapStoreToProps = store => ({
  isAuthenticated: store.users.isAuthenticated,
  token: store.users.user.token,
  peerConnections: store.dataChannel.peerConnections,
  socketIsOpen: store.socketService.isOpen,
  rooms: store.rooms.rooms,
  username: store.users.user.username,
  userId: store.users.user.userId,
  currentRoomId: store.rooms.currentRoomId,
})


const mapDispatchToProps = dispatch => ({
  createRoom: token => dispatch(roomsActions.createRoom(token)),
  connect: (url, token) => dispatch(socketActions.connect(url, token)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Rooms))
