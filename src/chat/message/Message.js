import React, { PropTypes } from 'react'

import './Message.scss'

const Message = ({ message, userId }) => {
  const side = message.userId === userId ? 'right' : 'left'
  return (
    <div className={`my-2 message-container message-container-${side}`}>
      <div className={`px-2 py-1 message message-${side}`}>
        {message.text}
      </div>
      <small className="text-muted">{message.username}</small>
    </div>
  )
}

Message.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    timestamp: PropTypes.number,
    username: PropTypes.string,
    userId: PropTypes.number,
  }).isRequired,
  userId: PropTypes.number,
}

Message.defaultProps = {
  userId: PropTypes.number,
}

export default Message
