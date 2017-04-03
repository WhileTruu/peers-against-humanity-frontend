import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import ApiService from '../../services/apiService'
import { actions } from '../'

class Room extends Component {
  constructor(props) {
    super(props)
    this.renderMembers = this.renderMembers.bind(this)
    this.exitRoom = this.exitRoom.bind(this)
  }
  componentDidMount() {
    const { currentRoomId, joinRoom, roomError, match } = this.props
    if (!currentRoomId) {
      ApiService.joinRoom(match.params.roomId)
        .then((room) => {
          joinRoom(room.id)
        })
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

  renderMembers() {
    const { currentRoomId, availableRooms } = this.props
    return Object.keys(availableRooms[currentRoomId].members)
      .filter(key => availableRooms[currentRoomId].members[key].active)
      .map(key => (
        <div key={key}>
          {availableRooms[currentRoomId].members[key].username}
        </div>
      ))
  }

  render() {
    const { availableRooms, currentRoomId, socketIsOpen } = this.props
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <div className="form-inline justify-content-between">
              <h1 className="panel-heading">Room {currentRoomId}</h1>
              <button
                type="button"
                className="btn btn-danger mr-3"
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
            {availableRooms && currentRoomId && !!availableRooms[currentRoomId] ? this.renderMembers() : ''}
          </div>
        </div>
      </div>
    )
  }
}

Room.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      roomId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  currentRoomId: PropTypes.number,
  joinRoom: PropTypes.func.isRequired,
  /* eslint-disable */
  availableRooms: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /* eslint-enable */
  socketIsOpen: PropTypes.bool.isRequired,
  exitRoom: PropTypes.func.isRequired,
  roomError: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
}

Room.defaultProps = {
  currentRoomId: null,
  availableRooms: null,
}

const mapStoreToProps = store => ({
  currentRoomId: store.rooms.currentRoomId,
  availableRooms: store.rooms.availableRooms,
  socketIsOpen: store.socketService.isOpen,
})


const mapDispatchToProps = dispatch => ({
  joinRoom: id => dispatch(actions.joinRoom(id)),
  exitRoom: id => dispatch(actions.exitRoom(id)),
  roomError: () => dispatch(actions.roomError()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Room))
