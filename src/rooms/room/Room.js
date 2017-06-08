import React, { Component, PropTypes as Types } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { actions as roomsActions } from '..'
import MemberList from './memberList'
import Chat from '../../chat'
import Header from '../../common/header'
import './Room.scss'
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
    const { room, user, dataChannel, finished, roundNumber } = this.props
    const canStartGame = (
      (finished && user.id === room.ownerId) ||
      (room && user.id === room.ownerId && !this.props.gameStarted &&
      dataChannel && dataChannel.users &&
      Object.keys(dataChannel.users).map(memberId => parseInt(memberId, 10))
        .filter(id => dataChannel.users[id].hasRTCDataChannel || id === user.id)
        .length >= 2)
    )
    return (
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Header
          navigation={[(
            <h4
              key="header-title"
              className={`panel-heading ${roundNumber && 'panel-heading-hide'}`}
              style={{ flex: 1, justifyContent: 'flex-start', display: 'flex' }}
            >
              room {room && room.id}
            </h4>
          ), (
            roundNumber ? (
              <h4
                key="header-round-number"
                className="header-round-number text-danger d-flex"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                { `round ${roundNumber}` }
              </h4>
            ) : ''
          ), (
            <span
              key="header-username"
              className="text-info d-flex"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {user && `${user.nickname || user.username}`}
            </span>
          ), (
            <div key="header-buttons" className="d-flex" style={{ flex: 1, justifyContent: 'flex-end' }}>
              {
                canStartGame &&
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
          )]}
        />
        {
          this.props.gameStarted ? (
            <Game />
          ) : (
            <div>
              <div className="container">
                <div className="pt-3">
                  <MemberList />
                </div>
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
  finished: Types.bool,
  roundNumber: Types.number,
}

Room.defaultProps = {
  room: null,
  error: null,
  gameStarted: false,
  dataChannel: null,
  finished: false,
  roundNumber: null,
}

const mapStoreToProps = store => ({
  roundNumber: store.game.roundNumber,
  user: store.user,
  room: store.rooms.room,
  isFetching: store.rooms.isFetching,
  error: store.rooms.error,
  socket: store.socket,
  gameStarted: store.game.started,
  dataChannel: store.dataChannel,
  finished: store.game.finished,
})

const mapDispatchToProps = dispatch => ({
  joinRoom: roomId => dispatch(roomsActions.joinRoom(roomId)),
  exitRoom: roomId => dispatch(roomsActions.exitRoom(roomId)),
  startGame: () => dispatch(gameActions.initializeGame()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Room))
