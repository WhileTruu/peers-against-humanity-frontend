import React, { Component, PropTypes as Types } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { actions as roomsActions } from '..'
import MemberList from './memberList'
import Chat from '../../chat'

import Game, { actions as gameActions } from '../../game'

class Room extends Component {
  componentDidMount() {
    const { room, match, socket } = this.props
    if (!room && socket.connected) {
      this.props.joinRoom(match.params.roomId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { room, socket, error, isFetching } = nextProps
    if (error) {
      this.props.history.replace('/rooms')
    } else if (!isFetching && !room && socket.connected) {
      this.props.joinRoom(this.props.match.params.roomId)
    }
  }

  componentWillUnmount() {
    if (this.props.room) this.props.exitRoom(this.props.room.id)
  }

  render() {
    const { room, members, user, dataChannel } = this.props
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 mt-3">
            <div className="form-inline justify-content-between align-items-start">
              <h2 className="panel-heading">room {room && room.id}</h2>
              <h3 className="text-success">
                {user && `${user.id} ${user.username || user.nickname}`}
              </h3>
              <div>
                {
                  (
                    room && user.id === room.ownerId && !this.props.gameStarted &&
                    dataChannel && dataChannel.users &&
                    Object.keys(dataChannel.users).map(memberId => parseInt(memberId, 10))
                      .filter(id => dataChannel.users[id].hasRTCDataChannel || id === user.id)
                      .length >= 2
                  ) &&
                  <button
                    className="btn btn-success ml-2"
                    onClick={this.props.startGame}
                  >
                    start game
                  </button>
                }
                <button
                  type="button"
                  className="btn btn-outline-danger ml-2"
                  onClick={() => this.props.history.replace('/rooms')}
                >
                  exit
                </button>
              </div>
            </div>
          </div>
        </div>
        {
          this.props.gameStarted ? (
            <Game />
          ) : (
            <div>
              <div className="mt-3">
                <MemberList
                  userId={this.props.user.id}
                  members={{ [this.props.user.id]: this.props.user, ...members }}
                />
              </div>
            </div>
          )
        }
        <Chat />
      </div>
    )
  }
}

Room.propTypes = {
  match: Types.shape({
    params: Types.shape({ roomId: Types.string.isRequired }).isRequired,
  }).isRequired,
  history: Types.shape({ replace: Types.func.isRequired }).isRequired,
  user: Types.shape(
    { id: Types.number, nickname: Types.string, username: Types.string },
  ).isRequired,
  room: Types.shape({ id: Types.number }),
  members: Types.shape({}),
  joinRoom: Types.func.isRequired,
  exitRoom: Types.func.isRequired,
  startGame: Types.func.isRequired,
  isFetching: Types.bool.isRequired,
  error: Types.string,
  socket: Types.shape(
    { connnecting: Types.bool, authenticating: Types.bool, connected: Types.bool },
  ).isRequired,
  gameStarted: Types.bool,
  dataChannel: Types.shape({}),
}

Room.defaultProps = {
  room: null,
  members: null,
  error: null,
  gameStarted: false,
  dataChannel: null,
}

const mapStoreToProps = store => ({
  user: store.user,
  room: store.rooms.room,
  isFetching: store.rooms.isFetching,
  error: store.rooms.error,
  socket: store.socket,
  gameStarted: store.game.started,
  members: store.dataChannel.users,
  dataChannel: store.dataChannel,
})

const mapDispatchToProps = dispatch => ({
  joinRoom: roomId => dispatch(roomsActions.joinRoom(roomId)),
  exitRoom: roomId => dispatch(roomsActions.exitRoom(roomId)),
  startGame: () => dispatch(gameActions.initializeGame()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Room))
