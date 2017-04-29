import React, { PropTypes as Types } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { actions as roomActions } from '../room'

const RoomList = ({ createRoom, socket, room, rooms, history, match }) => (
  <div>
    <div className="row">
      <div className="col-12">
        <div className="form-inline justify-content-between">
          <h1 className="panel-heading">Rooms</h1>
          {socket.connected ? (
            <button type="button" className="btn btn-info" onClick={() => createRoom()}>
              Create Room
            </button>
          ) : ''}
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        {rooms ? Object.entries(rooms).map(([roomId, roomEntry]) => (
          <div className="pb-3" key={roomId}>
            <div className="card">
              <div className="card-block">
                <div className="form-inline justify-content-between">
                  <h4 className="card-title">{roomId}</h4>
                  <div>
                    <button
                      className="btn btn-success mr-2"
                      onClick={() => history.push(`${match.url}/${roomId}`)}
                    >
                      {room.id ? 'enter' : 'join'}
                    </button>
                  </div>
                </div>
                <p className="card-text">
                  Room owned by {roomEntry.ownerNickname || roomEntry.ownerUsername}
                </p>
              </div>
            </div>
          </div>
        )) : ''}
      </div>
    </div>
  </div>
)

RoomList.propTypes = {
  rooms: Types.object, // eslint-disable-line react/forbid-prop-types
  history: Types.shape({ push: Types.func.isRequired }).isRequired,
  match: Types.shape({ url: Types.string.isRequired }).isRequired,
  room: Types.shape({ id: Types.number }).isRequired,
  socket: Types.shape({
    connected: Types.bool.isRequired,
    authenticating: Types.bool.isRequired,
    connecting: Types.bool.isRequired,
  }).isRequired,
  createRoom: Types.func.isRequired,
}

RoomList.defaultProps = {
  rooms: null,
}


const mapStoreToProps = store => ({
  isAuthenticated: store.users.isAuthenticated,
  socket: store.socket,
  rooms: store.rooms.rooms,
  room: store.room,
})

const mapDispatchToProps = dispatch => ({
  createRoom: () => dispatch(roomActions.createRoom()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(RoomList))
