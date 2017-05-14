/* eslint-disable */
import React from 'react'

const memberListItem = ({ member, userId }) => {
  return (
    <li className={`list-group-item justify-content-between ${member.id}`} key={member.id}>
      <div>
        {member.nickname || member.username}
        {member.id !== userId ?
          (<span className={`ml-2 badge badge-${member.hasRTCDataChannel ? 'success' : 'info'} badge-pill`}>
            {member.hasRTCDataChannel ? 'connected' : 'connecting...'}
          </span>) :
          (<span className={`ml-2 badge badge-primary badge-pill`}>
            you
          </span>)
        }
      </div>
      <div>
        0 points
      </div>
    </li>
  )
}

export default ({ members, userId }) => (
  <div>
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
