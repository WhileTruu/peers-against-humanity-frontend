import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import DataChannelService from '../../services/webRTCDataChannel'
import ApiService from '../../services/apiService'
import { actions } from '../'
import MemberList from './memberList'
import Chat from '../../chat'

class Room extends Component {
  constructor(props) {
    super(props)
    this.exitRoom = this.exitRoom.bind(this)
    this.makePeerConnections = this.makePeerConnections.bind(this)
  }

  componentDidMount() {
    const { currentRoomId, joinRoom, roomError, match } = this.props
    if (!currentRoomId) {
      ApiService.joinRoom(match.params.roomId)
        .then(room => joinRoom(room.id))
        .catch(() => {
          this.props.history.replace('/rooms')
          roomError()
        })
    }
  }

  exitRoom() {
    this.props.history.replace('/rooms')
    this.props.exitRoom(this.props.match.params.roomId)
  }

  makePeerConnections() {
    const { currentRoomId, availableRooms } = this.props
    Object.keys(availableRooms[currentRoomId].members)
      .filter(peerId => availableRooms[currentRoomId].members[peerId].active)
      .forEach((peerId) => {
        if (parseInt(peerId, 10) !== this.props.userId) {
          DataChannelService.requestNewPeerConnection(peerId)
        }
      })
  }

  render() {
    const { availableRooms, currentRoomId, socketIsOpen, peerConnections } = this.props
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
            {availableRooms && currentRoomId && !!availableRooms[currentRoomId] ?
              (
                <MemberList
                  userId={this.props.userId}
                  members={availableRooms[currentRoomId].members}
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
  availableRooms: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  peerConnections: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /* eslint-enable */
  socketIsOpen: PropTypes.bool.isRequired,
  exitRoom: PropTypes.func.isRequired,
  roomError: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  userId: PropTypes.number,
}

Room.defaultProps = {
  peerConnections: null,
  currentRoomId: null,
  availableRooms: null,
  userId: null,
}

const mapStoreToProps = store => ({
  peerConnections: store.dataChannel.peerConnections,
  currentRoomId: store.rooms.currentRoomId,
  availableRooms: store.rooms.availableRooms,
  socketIsOpen: store.socketService.isOpen,
  userId: store.auth.userId,
})

const mapDispatchToProps = dispatch => ({
  joinRoom: id => dispatch(actions.joinRoom(id)),
  exitRoom: id => dispatch(actions.exitRoom(id)),
  roomError: () => dispatch(actions.roomError()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Room))
