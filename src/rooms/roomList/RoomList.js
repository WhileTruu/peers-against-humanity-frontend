import React, { PropTypes as Types } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { actions as roomsActions } from '..'

const socketState = (socket) => {
  if (socket.connecting) return { text: 'connecting...', textStyle: 'text-info' }
  if (socket.authenticating) return { text: 'authenticating...', textStyle: 'text-warn' }
  if (socket.connected) return { text: 'connected', textStyle: 'text-success' }
  return { text: 'disconnected', textStyle: 'text-primary' }
}

const RoomList = ({ createRoom, joinRoom, socket, rooms }) => (
  <div className="container">
    <div className="row">
      <div className="col-12 mt-3">
        <div className="form-inline justify-content-between">
          <h1 className="panel-heading">rooms</h1>
          {socket.connected ? (
            <button type="button" className="btn btn-info" onClick={() => createRoom()}>
              create room
            </button>
          ) : ''}
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        {
          socket && (
            <h3 className={socketState(socket).textStyle}>
              server is {socketState(socket).text}
            </h3>
          )
        }
        {
          (!rooms || (rooms && !Object.keys(rooms).length)) && (
            <h3 className="text-info">no available rooms at the moment</h3>
          )
        }
        <div className="list-group">
          {
            rooms &&
            Object.entries(rooms).map(([roomId, roomEntry]) => (
              <div
                key={roomId}
                className={`
                  list-group-item list-group-item-action align-items-center
                `}
              >
                <div className="d-flex w-100 justify-content-between">
                  <div className="d-flex">
                    <h5
                      className="mb-1"
                    >
                      {roomId}
                    </h5>
                  </div>
                  <div>
                    <small>
                      {
                        (() => {
                          const date = new Date(roomEntry.createdAt)
                          const hours = date.getTimezoneOffset() / 60
                          date.setHours(date.getHours() - hours)
                          return (
                            <div>
                              <span className="text-info">created at</span>
                              {` ${date.toLocaleString()}`}
                            </div>)
                        })()
                      }
                    </small>
                  </div>
                </div>
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <small>
                    {`${roomEntry.ownerNickname || roomEntry.ownerUsername} `}
                    <span className="text-info">
                      is the room owner
                    </span>
                  </small>
                  <button
                    className="btn btn-success"
                    onClick={() => joinRoom(roomId)}
                  >
                    join
                  </button>
                </div>
              </div>
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
