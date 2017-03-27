import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { actions as socketActions } from '../services/webSocket'
import { actions as dataChannelActions } from '../services/webRTCDataChannel'

class Rooms extends Component {
  constructor(props) {
    super(props)
    this.renderRooms = this.renderRooms.bind(this)
    this.state = {
      attemptedConnection: false,
    }
  }

  componentDidMount() {
    this.connectWebsocketIfPossible(this.props.token)
  }

  componentWillReceiveProps(nextProps) {
    this.connectWebsocketIfPossible(nextProps.token)
  }

  componentWillUnmount() {
    if (this.props.socketIsOpen) this.props.closeSocketConnection()
  }

  connectWebsocketIfPossible(token) {
    if (!!token && !this.props.socketIsOpen && !this.state.attemptedConnection) {
      this.props.connectWebSocket('localhost:8080/api/v1/rooms', token)
      this.setState({ attemptedConnection: true })
    }
  }

  renderRooms() {
    return Object.entries(this.props.availableRooms).map(([key, value]) => (
      <div className="pb-3" key={key}>
        <div className="card">
          <div className="card-block">
            <div className="form-inline justify-content-between">
              <h4 className="card-title">{key}</h4>
              <button className="btn btn-success">enter</button>
            </div>
            <p className="card-text">
              Room created by {value.creator.username}
            </p>
            <p className="card-text">People in room: {Object.keys(value.members).length + 1}</p>
          </div>
        </div>
      </div>
    ))
  }

  render() {
    console.log(this.props.room)
    const {
      // requestNewPeerConnection,
      socketIsOpen,
      userId,
      username,
    } = this.props
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <div className="form-inline justify-content-between">
              <h1 className="panel-heading">Rooms</h1>
              <button
                type="button"
                className="btn btn-info mr-3"
                onClick={() => this.props.createRoom(userId, username)}
              >
                Create Room
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
            {this.props.availableRooms ? this.renderRooms() : ''}
          </div>
        </div>
      </div>
    )
  }
}

Rooms.propTypes = {
  connectWebSocket: PropTypes.func.isRequired,
  closeSocketConnection: PropTypes.func.isRequired,
  // requestNewPeerConnection: PropTypes.func.isRequired,
  createRoom: PropTypes.func.isRequired,
  // peerConnections: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  socketIsOpen: PropTypes.bool.isRequired,
  token: PropTypes.string,
  username: PropTypes.string,
  userId: PropTypes.number,
  availableRooms: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  room: PropTypes.shape({
    id: PropTypes.string,
    creator: PropTypes.string,
    members: PropTypes.object,
  }),
}

Rooms.defaultProps = {
  token: null,
  username: null,
  userId: null,
  availableRooms: null,
  room: null,
}

const mapStoreToProps = store => ({
  peerConnections: store.dataChannel.peerConnections,
  socketIsOpen: store.socketService.isOpen,
  availableRooms: store.socketService.availableRooms,
  room: store.socketService.room,
  token: store.auth.token,
  username: store.auth.username,
  userId: store.auth.userId,
})


const mapDispatchToProps = dispatch => ({
  connectWebSocket: (url, token) => dispatch(socketActions.connectWebSocket(url, token)),
  closeSocketConnection: () => dispatch(socketActions.closeSocketConnection()),
  requestNewPeerConnection: peerId => dispatch(dataChannelActions.requestNewPeerConnection(peerId)),
  createRoom: (userId, username) => dispatch(socketActions.createRoom(userId, username)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(Rooms)
