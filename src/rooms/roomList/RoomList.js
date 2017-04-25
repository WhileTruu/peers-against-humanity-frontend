import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { actions as roomActions } from '../room'
import { actions as socketActions } from '../../services/webSocket'

class RoomList extends Component {
  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.connect(this.props.token)
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((!this.props.isAuthenticated && nextProps.isAuthenticated)) {
      this.props.connect(nextProps.token)
    }
  }

  render() {
    const { createRoom, socketIsOpen, currentRoomId, rooms, history, match, token } = this.props
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <div className="form-inline justify-content-between">
              <h1 className="panel-heading">Rooms</h1>
              {socketIsOpen ? (
                <button type="button" className="btn btn-info" onClick={() => createRoom(token)}>
                  Create Room
                </button>
              ) : ''}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h3
              className={socketIsOpen ? 'text-info' : 'text-danger'}
            >
              SOCKET IS {socketIsOpen ? 'OPEN' : 'CLOSED'}
            </h3>
            {rooms ? Object.entries(rooms).map(([roomId, room]) => (
              <div className="pb-3" key={roomId}>
                <div className="card">
                  <div className="card-block">
                    <div className="form-inline justify-content-between">
                      <h4 className="card-title">{roomId}</h4>
                      <div>
                        {currentRoomId === room.id || !currentRoomId ? (
                          <button
                            className="btn btn-success mr-2"
                            onClick={() => history.push(`${match.url}/${roomId}`)}
                          >
                            {currentRoomId ? 'enter' : 'join'}
                          </button>
                        ) : ''
                        }
                      </div>
                    </div>
                    <p className="card-text">
                      Room owned by {room.ownerNickname || room.ownerUsername}
                    </p>
                    <p className="card-text">
                      People in room: // TODO
                    </p>
                  </div>
                </div>
              </div>
            )) : ''}
          </div>
        </div>
      </div>
    )
  }
}

RoomList.propTypes = {
  connect: PropTypes.func.isRequired,
  rooms: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  currentRoomId: PropTypes.number,
  socketIsOpen: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  createRoom: PropTypes.func.isRequired,
  token: PropTypes.string,
}

RoomList.defaultProps = {
  rooms: null,
  currentRoomId: null,
  token: null,
}


const mapStoreToProps = store => ({
  isAuthenticated: store.users.isAuthenticated,
  socketIsOpen: store.socketService.isOpen,
  rooms: store.rooms.rooms,
  currentRoomId: store.room.id,
  token: store.users.token,
})

const mapDispatchToProps = dispatch => ({
  createRoom: token => dispatch(roomActions.createRoom(token)),
  connect: token => dispatch(socketActions.connect(token)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(RoomList))
