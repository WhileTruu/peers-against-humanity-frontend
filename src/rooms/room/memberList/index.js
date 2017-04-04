/* eslint-disable */
import React from 'react'

const memberListItem = ({ member, peerConnections }) => {
  const memberConnection = peerConnections ? peerConnections[member.id] : null
  const dataChannel = memberConnection ? memberConnection.dataChannel : null
  return (
    <li className="list-group-item justify-content-between" key={member.id}>
      {member.username}
      <span className={`badge badge-${dataChannel ? 'success' : 'info'} badge-pill`}>
        {dataChannel ? dataChannel.readyState : 'none'}
      </span>
    </li>
  )
}

export default ({ members, peerConnections }) => (
  <div>
    <ul className="list-group">
      {Object.keys(members)
        .filter(key => members[key].active)
        .map(key => (
          memberListItem({
            member: members[key],
            peerConnections,
          })
        ))
      }
    </ul>
  </div>
)
