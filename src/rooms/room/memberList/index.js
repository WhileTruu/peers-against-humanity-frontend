/* eslint-disable */
import React from 'react'

const memberListItem = ({ member, userId }) => {
  return (
    <li className={`list-group-item justify-content-between ${member.id}`} key={member.id}>
      {member.nickname || member.username}
      {member.id !== userId ?
        (<span className={`badge badge-${member.hasRTCDataChannel ? 'success' : 'info'} badge-pill`}>
          {member.hasRTCDataChannel ? 'connected' : 'connecting...'}
        </span>) :
        (<span className={`badge badge-primary badge-pill`}>
          you
        </span>)
      }
    </li>
  )
}

export default ({ members, userId }) => (
  <div className="container mt-3">
    <ul className="list-group">
      {Object.keys(members)
        .filter(id => members[id].active !== false)
        .map(key => (
          memberListItem({
            member: members[key],
            userId,
          })
        ))
      }
    </ul>
  </div>
)
