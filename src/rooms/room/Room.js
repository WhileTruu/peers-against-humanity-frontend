import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { actions } from '../'
import MemberList from './memberList'
import Chat from '../../chat'

class Room extends Component {
  constructor(props) {
    super(props)
    this.exitRoom = this.exitRoom.bind(this)
  }

  componentDidMount() {
    const { currentRoomId, match, userId, token } = this.props
    if (!currentRoomId) {
      this.props.joinRoom(match.params.roomId, userId, token)
    }
  }

  exitRoom() {
    const { currentRoomId, userId, token } = this.props
    this.props.history.replace('/rooms')
    this.props.exitRoom(currentRoomId, userId, token)
  }

  render() {
    const { rooms, currentRoomId, socketIsOpen, peerConnections } = this.props
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <div className="form-inline justify-content-between">
              <h1 className="panel-heading">Room {currentRoomId}</h1>
              <button
                type="button"
                className="btn btn-danger"
                onClick={this.exitRoom}
              >
                exit room
              </button>
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
            {rooms && currentRoomId && !!rooms[currentRoomId] ?
              (
                <MemberList
                  userId={this.props.userId}
                  members={rooms[currentRoomId].members}
                  peerConnections={peerConnections}
                />
              ) : ''
            }
            <button
              className="form-control"
              onClick={this.makePeerConnections}
            >
              connect
            </button>
            <Chat />
          </div>
        </div>
      </div>
    )
  }
}

Room.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({ roomId: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
  currentRoomId: PropTypes.number,
  joinRoom: PropTypes.func.isRequired,
  /* eslint-disable */
  rooms: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  peerConnections: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /* eslint-enable */
  socketIsOpen: PropTypes.bool.isRequired,
  exitRoom: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  userId: PropTypes.number,
  token: PropTypes.string,
}

Room.defaultProps = {
  peerConnections: null,
  currentRoomId: null,
  rooms: null,
  userId: null,
  token: null,
}

const mapStoreToProps = store => ({
  peerConnections: store.dataChannel.peerConnections,
  currentRoomId: store.rooms.currentRoomId,
  rooms: store.rooms.rooms,
  socketIsOpen: store.socketService.isOpen,
  userId: store.users.user.userId,
  token: store.users.user.token,
})

const mapDispatchToProps = dispatch => ({
  joinRoom: (roomId, userId, token) => dispatch(actions.joinRoom(roomId, userId, token)),
  exitRoom: (roomId, userId, token) => dispatch(actions.exitRoom(roomId, userId, token)),
  roomError: () => dispatch(actions.roomError()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Room))
