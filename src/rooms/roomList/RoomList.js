import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'

const RoomList = ({ createRoom, socketIsOpen, currentRoomId, rooms, history, match }) => (
  <div>
    <div className="row">
      <div className="col-12">
        <div className="form-inline justify-content-between">
          <h1 className="panel-heading">Rooms</h1>
          {socketIsOpen ? (<button
            type="button"
            className="btn btn-info"
            onClick={createRoom}
          >
            Create Room
          </button>) : ''}
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
        {rooms ? Object.entries(rooms).map(([roomId, room]) => (
          <div className="pb-3" key={roomId}>
            <div className="card">
              <div className="card-block">
                <div className="form-inline justify-content-between">
                  <h4 className="card-title">{roomId}</h4>
                  <div>
                    {currentRoomId === room.id || !currentRoomId ? (
                      <button
                        className="btn btn-success mr-2"
                        onClick={() => history.push(`${match.url}/${roomId}`)}
                      >
                        {currentRoomId ? 'enter' : 'join'}
                      </button>
                    ) : ''
                    }
                  </div>
                </div>
                <p className="card-text">
                  Room created by {room.ownerUsername}
                </p>
                <p className="card-text">
                  People in room: {
                    Object.values(room.members).filter(member => member.active).length
                  }
                </p>
              </div>
            </div>
          </div>
        )) : ''}
      </div>
    </div>
  </div>
)

RoomList.propTypes = {
  rooms: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  currentRoomId: PropTypes.number,
  socketIsOpen: PropTypes.bool.isRequired,
  createRoom: PropTypes.func.isRequired,
}

RoomList.defaultProps = {
  rooms: null,
  currentRoomId: null,
}

export default withRouter(RoomList)
