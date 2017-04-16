import React, { Component, PropTypes as Types } from 'react'
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
  match: Types.shape({
    params: Types.shape({ roomId: Types.string.isRequired }).isRequired,
  }).isRequired,
  history: Types.shape({ replace: Types.func.isRequired }).isRequired,
  peers: Types.shape({
    [Types.string]: Types.shape({ id: Types.number.isRequired, connected: Types.bool.isRequired }),
  }),
  socketIsOpen: Types.bool.isRequired,
  userId: Types.number,
  token: Types.string,
  room: Types.shape({ id: Types.number }).isRequired,
  members: Types.shape({ id: Types.number, username: Types.string, active: Types.bool }),
  joinRoom: Types.func.isRequired,
  exitRoom: Types.func.isRequired,
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
  userId: store.users.user.id,
  token: store.users.token,
  room: store.room.room,
  members: store.room.members,
})

const mapDispatchToProps = dispatch => ({
  joinRoom: (roomId, userId, token) => dispatch(actions.joinRoom(roomId, userId, token)),
  exitRoom: (roomId, userId, token) => dispatch(actions.exitRoom(roomId, userId, token)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Room))
