import React, { PropTypes as Types } from 'react'
import { connect } from 'react-redux'

const UserListItem = ({ player, user, userId, roomOwnerId }) => (
  <li className={`list-group-item justify-content-between ${user.id}`} key={user.id}>
    <div>
      { user.nickname || user.username }
      {
        user.id !== userId &&
        (
          <span
            className={'ml-2 badge badge-pill'}
            style={{ border: `1px solid rgba(${user.hasRTCDataChannel ? '0, 190, 0, 1' : '0, 0, 0, 0.25'})` }}
          >
            {user.hasRTCDataChannel ? '📡' : '📡...'}
          </span>
        )
      }
      {
        user.id === roomOwnerId && (
          <span className={'ml-2 badge badge-pill'} style={{ border: '1px solid rgba(0, 0, 0, 0.25)' }}>
            { '👑' }
          </span>
        )
      }
    </div>
    <div>
      { (player && player.points !== 0) && player.points }
    </div>
  </li>
)

UserListItem.propTypes = {
  user: Types.shape({}),
  userId: Types.number,
  player: Types.shape({}),
  roomOwnerId: Types.number,
}

UserListItem.defaultProps = {
  user: null,
  userId: null,
  player: null,
  roomOwnerId: null,
}

const UserList = ({ users, user, players, roomOwnerId }) => (
  <div>
    <ul className="list-group">
      {
        user &&
        UserListItem({ player: players && players[user.id], user, userId: user.id, roomOwnerId })
      }
      {
        users &&
        Object.keys(users)
          .filter(id => users[id].active !== false)
          .map(key => (
            UserListItem({
              player: players && players[key],
              user: users[key],
              userId: user.id,
              roomOwnerId,
            })
          ))
      }
    </ul>
  </div>
)


UserList.propTypes = {
  users: Types.shape({}),
  user: Types.shape({}),
  players: Types.shape({}),
  roomOwnerId: Types.number,
}

UserList.defaultProps = {
  users: null,
  user: null,
  players: null,
  roomOwnerId: null,
}

const mapStoreToProps = store => ({
  users: store.dataChannel.users,
  user: store.user,
  players: store.game.players,
  roomOwnerId: store.rooms.room && store.rooms.room.ownerId,
})

export default connect(mapStoreToProps)(UserList)
