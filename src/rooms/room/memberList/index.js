/* eslint-disable */
import React from 'react'

const memberListItem = ({ member, peerConnections, userId }) => {
  const memberConnection = peerConnections ? peerConnections[member.id] : null
  const dataChannel = memberConnection ? memberConnection.dataChannel : null
  return (
    <li className="list-group-item justify-content-between" key={member.id}>
      {member.username}
      {member.id !== userId ?
        (<span className={`badge badge-${dataChannel ? 'success' : 'info'} badge-pill`}>
          {memberConnection && memberConnection.hasDataChannel ? dataChannel.readyState : 'none'}
        </span>) :
        (<span className={`badge badge-primary badge-pill`}>
          you
        </span>)
      }
    </li>
  )
}

export default ({ members, peerConnections, userId }) => (
  <div>
    <ul className="list-group">
      {Object.keys(members)
        .filter(key => members[key].active)
        .map(key => (
          memberListItem({
            member: members[key],
            peerConnections,
            userId,
          })
        ))
      }
    </ul>
  </div>
)
