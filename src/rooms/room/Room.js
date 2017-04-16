import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { actions } from '.'
import MemberList from './memberList'
import Chat from '../../chat'

class Room extends Component {
  constructor(props) {
    super(props)
    this.exitRoom = this.exitRoom.bind(this)
  }

  componentDidMount() {
    const { room, match, userId, token } = this.props
    if (!room.id) {
      this.props.joinRoom(match.params.roomId, userId, token)
    }
  }

  exitRoom() {
    const { room, userId, token } = this.props
    this.props.history.replace('/rooms')
    this.props.exitRoom(room.id, userId, token)
  }

  render() {
    const { room, members, socketIsOpen, peers } = this.props
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <div className="form-inline justify-content-between">
              <h1 className="panel-heading">Room {room.id}</h1>
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
            {room.id && members ?
              (
                <MemberList
                  userId={this.props.userId}
                  members={members}
                  peers={peers}
                />
              ) : ''
            }
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
  joinRoom: PropTypes.func.isRequired,
  peers: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      id: PropTypes.number.isRequired,
      connected: PropTypes.bool.isRequired,
      negotiating: PropTypes.bool.isRequired,
    }),
  }),
  socketIsOpen: PropTypes.bool.isRequired,
  exitRoom: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  userId: PropTypes.number,
  token: PropTypes.string,
  room: PropTypes.shape({
    id: PropTypes.number,
    creatorId: PropTypes.number,
    ownerId: PropTypes.number,
    started: PropTypes.bool,
    finished: PropTypes.bool,
    createdAt: PropTypes.string,
    ownerUsername: PropTypes.string,
  }).isRequired,
  members: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    active: PropTypes.bool,
  }),
}

Room.defaultProps = {
  peers: null,
  userId: null,
  token: null,
  members: null,
}

const mapStoreToProps = store => ({
  peers: store.dataChannel.peers,
  socketIsOpen: store.socketService.isOpen,
  userId: store.users.user.userId,
  token: store.users.user.token,
  room: store.room.room,
  members: store.room.members,
})

const mapDispatchToProps = dispatch => ({
  joinRoom: (roomId, userId, token) => dispatch(actions.joinRoom(roomId, userId, token)),
  exitRoom: (roomId, userId, token) => dispatch(actions.exitRoom(roomId, userId, token)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Room))
