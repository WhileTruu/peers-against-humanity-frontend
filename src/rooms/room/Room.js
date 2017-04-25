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
    const { room, match, token } = this.props
    if (!room.id) {
      this.props.joinRoom(match.params.roomId, token)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isFetching && !nextProps.isFetching && nextProps.errorStatusCode) {
      this.props.history.replace('/rooms')
    }
  }

  exitRoom() {
    const { room, token, user } = this.props
    this.props.history.replace('/rooms')
    if (room.ownerId === user.id) this.props.ownerExitRoom(room.id, token)
    else this.props.exitRoom()
  }

  render() {
    const { room, members, socketIsOpen } = this.props
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
            <MemberList
              userId={this.props.user.id}
              members={{ [this.props.user.id]: this.props.user, ...members }}
            />
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
  socketIsOpen: Types.bool.isRequired,
  user: Types.shape({
    id: Types.number,
    nickname: Types.string,
    username: Types.string,
  }).isRequired,
  token: Types.string,
  room: Types.shape({ id: Types.number }).isRequired,
  members: Types.shape({ id: Types.number, username: Types.string, active: Types.bool }),
  joinRoom: Types.func.isRequired,
  exitRoom: Types.func.isRequired,
  ownerExitRoom: Types.func.isRequired,
  isFetching: Types.bool.isRequired,
  errorStatusCode: Types.number, // eslint-disable-line
}

Room.defaultProps = {
  token: null,
  members: null,
  errorStatusCode: null,
}

const mapStoreToProps = store => ({
  socketIsOpen: store.socketService.isOpen,
  user: store.users.user,
  token: store.users.token,
  room: store.room,
  members: store.room.members,
  isFetching: store.room.isFetching,
  errorStatusCode: store.room.errorStatusCode,
})

const mapDispatchToProps = dispatch => ({
  joinRoom: (roomId, token) => dispatch(actions.joinRoom(roomId, token)),
  exitRoom: (roomId, token) => dispatch(actions.exitRoom(roomId, token)),
  ownerExitRoom: (roomId, token) => dispatch(actions.ownerExitRoom(roomId, token)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Room))
