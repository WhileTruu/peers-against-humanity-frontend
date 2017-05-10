import React, { PropTypes as Types } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { actions as roomsActions } from '..'

const RoomList = ({ createRoom, joinRoom, socket, rooms }) => (
  <div className="my-5">
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
        {
          rooms && Object.keys(rooms).length ? (
            <h3 className="text-success">Click on a room to join</h3>
          ) : (
            <h3 className="text-info">No available rooms at the moment</h3>
          )
        }
        <div className="list-group">
          {
            rooms &&
            Object.entries(rooms).map(([roomId, roomEntry]) => (
              <button
                key={roomId}
                onClick={() => joinRoom(roomId)}
                className={`
                  list-group-item list-group-item-action align-items-start
                `}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{roomId}</h5>
                  <div>
                    <small>
                      {
                        (() => {
                          const date = new Date(roomEntry.createdAt)
                          const hours = date.getTimezoneOffset() / 60
                          date.setHours(date.getHours() - hours)
                          return `created at ${date.toLocaleString()}`
                        })()
                      }
                    </small>
                  </div>
                </div>
                <small>
                  {`${roomEntry.ownerNickname || roomEntry.ownerUsername} `}
                  <span className="text-info">
                    is the room owner
                  </span>
                </small>
              </button>
            ))
          }
        </div>
      </div>
    </div>
  </div>
)

RoomList.propTypes = {
  rooms: Types.object, // eslint-disable-line react/forbid-prop-types
  socket: Types.shape({
    connected: Types.bool.isRequired,
    authenticating: Types.bool.isRequired,
    connecting: Types.bool.isRequired,
  }).isRequired,
  createRoom: Types.func.isRequired,
  joinRoom: Types.func.isRequired,
}

RoomList.defaultProps = {
  rooms: null,
}


const mapStoreToProps = store => ({
  isAuthenticated: store.user.isLoggedIn,
  socket: store.socket,
  rooms: store.rooms.rooms,
})

const mapDispatchToProps = dispatch => ({
  createRoom: () => dispatch(roomsActions.createRoom()),
  joinRoom: roomId => dispatch(roomsActions.joinRoom(roomId)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(RoomList))
