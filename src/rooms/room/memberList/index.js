import React, { PropTypes as Types } from 'react'
import { connect } from 'react-redux'

const UserListItem = ({ player, user, userId }) => (
  <li className={`list-group-item justify-content-between ${user.id}`} key={user.id}>
    <div>
      {user.nickname || user.username}
      {user.id !== userId ?
        (<span className={`ml-2 badge badge-${user.hasRTCDataChannel ? 'success' : 'info'} badge-pill`}>
          {user.hasRTCDataChannel ? 'connected' : 'connecting...'}
        </span>) :
        (<span className={'ml-2 badge badge-primary badge-pill'}>
          you
        </span>)
      }
      <span className={'ml-2 badge badge-info badge-pill'}>
        { user.id }
      </span>
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
}

UserListItem.defaultProps = {
  user: null,
  userId: null,
  player: null,
}

const UserList = ({ users, user, players }) => (
  <div>
    <ul className="list-group">
      {
        user &&
        UserListItem({ player: players && players[user.id], user, userId: user.id })
      }
      {
        users &&
        Object.keys(users)
          .filter(id => users[id].active !== false)
          .map(key => (
            UserListItem({ player: players && players[key], user: users[key], userId: user.id })
          ))
      }
    </ul>
  </div>
)


UserList.propTypes = {
  users: Types.shape({}),
  user: Types.shape({}),
  players: Types.shape({}),
}

UserList.defaultProps = {
  users: null,
  user: null,
  players: null,
}

const mapStoreToProps = store => ({
  users: store.dataChannel.users,
  user: store.user,
  players: store.game.players,
})

export default connect(mapStoreToProps)(UserList)
