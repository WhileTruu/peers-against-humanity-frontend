import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

import RoomList from './roomList'

import Room from './room'
import AuthOptions from '../users/authOptions'

const Rooms = ({ isAuthenticated, currentRoomId, match }) => (
  <div>
    {currentRoomId ? <Redirect to={`/rooms/${currentRoomId}`} /> : ''}
    {!isAuthenticated ? <AuthOptions url={match.url} /> : ''}
    {isAuthenticated ?
      <div>
        <Route exact path="/rooms" component={RoomList} />
        <Route path="/rooms/:roomId" component={Room} />
      </div>
    : ''}
  </div>
)

Rooms.propTypes = {
  currentRoomId: PropTypes.number,
  isAuthenticated: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
}

Rooms.defaultProps = {
  currentRoomId: null,
}

const mapStoreToProps = store => ({
  isAuthenticated: store.users.isAuthenticated,
  currentRoomId: store.room.id,
})

export default connect(mapStoreToProps)(withRouter(Rooms))
