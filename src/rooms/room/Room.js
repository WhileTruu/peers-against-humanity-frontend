/* eslint-disable */
import React, { Component, PropTypes as Types } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { actions as roomActions } from '.'
import MemberList from './memberList'
import Chat from '../../chat'

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0,
    }
  }

  componentDidMount() {
    const { room, match, token, isFetching, error, socket } = this.props
    if (!room.id && socket.connected) {
      this.props.joinRoom(match.params.roomId, token)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { room, socket, isFetching, error } = nextProps
    if (error) {
      this.props.history.replace('/rooms')
    } else if (!room.id && socket.connected && this.state.counter < 4) {// && !error  && !isFetching ) {
      this.props.joinRoom(this.props.match.params.roomId, this.props.token)
      this.setState({ counter: this.state.counter + 1 })
      console.log(this.state.counter)
    }
  }

  render() {
    const { room, members, exitRoom, socket, connectedExitRoom } = this.props
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <div className="form-inline justify-content-between">
              <h1 className="panel-heading">Room {room.id}</h1>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  this.props.history.replace('/rooms')
                  socket.connected ? connectedExitRoom(room.id) : exitRoom(room.id)
                }}
              >
                exit room
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
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
  connectedExitRoom: Types.func.isRequired,
  isFetching: Types.bool.isRequired,
  error: Types.string, // eslint-disable-line
  socket: Types.shape({ // eslint-disable-line
    connecting: Types.bool.isRequired,
    authenticating: Types.bool.isRequired,
    connected: Types.bool.isRequired,
  }).isRequired,
}

Room.defaultProps = {
  token: null,
  members: null,
  errorStatusCode: null,
}

const mapStoreToProps = store => ({
  user: store.users.user,
  token: store.users.token,
  room: store.room,
  members: store.room.members,
  isFetching: store.room.isFetching,
  error: store.room.error,
  socket: store.socket,
})

const mapDispatchToProps = dispatch => ({
  joinRoom: roomId => dispatch(roomActions.joinRoom(roomId)),
  exitRoom: roomId => dispatch(roomActions.exitRoom(roomId)),
  connectedExitRoom: roomId => dispatch(roomActions.connectedExitRoom(roomId))
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Room))
