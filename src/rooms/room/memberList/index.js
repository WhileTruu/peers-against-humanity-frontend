/* eslint-disable */
import React from 'react'

const memberListItem = ({ member, userId }) => {
  return (
    <li className="list-group-item justify-content-between" key={member.id}>
      {member.nickname || member.username}
      {member.id !== userId ?
        (<span className={`badge badge-${member.hasDataChannel ? 'success' : 'info'} badge-pill`}>
          {member.hasDataChannel ? 'connected' : 'connecting...'}
        </span>) :
        (<span className={`badge badge-primary badge-pill`}>
          you
        </span>)
      }
    </li>
  )
}

export default ({ members, userId }) => (
  <div>
    <ul className="list-group">
      {Object.keys(members)
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
