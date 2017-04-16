/* eslint-disable */
import React from 'react'

const memberListItem = ({ member, peers, userId }) => {
  const peer = peers ? peers[member.id] : null
  return (
    <li className="list-group-item justify-content-between" key={member.id}>
      {member.username}
      {member.id !== userId ?
        (<span className={`badge badge-${peer && peer.connected ? 'success' : 'info'} badge-pill`}>
          {peer && peer.connected ? 'connected' : 'negotiating'}
        </span>) :
        (<span className={`badge badge-primary badge-pill`}>
          you
        </span>)
      }
    </li>
  )
}

export default ({ members, peers, userId }) => (
  <div>
    <ul className="list-group">
      {Object.keys(members)
        .filter(key => members[key].active)
        .map(key => (
          memberListItem({
            member: members[key],
            peers,
            userId,
          })
        ))
      }
    </ul>
  </div>
)
