/* eslint-disable */
import React from 'react'

function isMemberConnected(peerConnections, memberId) {
  return Object.keys(peerConnections).includes(memberId.toString())
}

const memberListItem = ({ member, isConnected }) => (
  <li className="list-group-item justify-content-between" key={member.id}>
    {member.username}
    <span className={`badge badge-${isConnected ? 'success' : 'info'} badge-pill`}>
      {isConnected ? 'connected' : 'not connected'}
    </span>
  </li>
)

export default ({ members, peerConnections }) => (
  <div>
    <ul className="list-group">
      {Object.keys(members)
        .filter(key => members[key].active)
        .map(key => (
          memberListItem({
            member: members[key],
            isConnected: isMemberConnected(peerConnections, key),
          })
        ))
      }
    </ul>
  </div>
)
