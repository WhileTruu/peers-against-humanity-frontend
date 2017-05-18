import React, { Component, PropTypes } from 'react'

import Message from '../message'

import './MessageArea.scss'

class MessageArea extends Component {

  componentWillReceiveProps(nextProps) {
    if (this.props.composerHeight === nextProps.composerHeight) return
    const composerHeight = nextProps.composerHeight || 0
    this.messageArea.style.bottom = `${Math.min(composerHeight, 150)}px`
    // this.messageArea.style.top = `${document.querySelector('.chat-header').scrollHeight}px`
  }

  componentDidUpdate() {
    this.messageArea.style.top = `${document.querySelector('.chat-header').scrollHeight}px`
    this.messageArea.scrollTop = this.messageArea.scrollHeight
  }

  render() {
    const { messages, userId } = this.props
    return (
      <div
        className="message-area" style={{ bottom: '54px', top: '44px' }}
        ref={(input) => { this.messageArea = input }}
      >
        <div
          className="px-3 pt-3"
        >
          {messages ? messages.map(message => (
            <Message
              key={message.timestamp}
              userId={userId}
              message={message}
            />
          )) : ''}
        </div>
      </div>
    )
  }
}

MessageArea.propTypes = {
  userId: PropTypes.number,
  composerHeight: PropTypes.number,
  messages: PropTypes.arrayOf(PropTypes.object),
}

MessageArea.defaultProps = {
  userId: null,
  composerHeight: null,
  messages: null,
}

export default MessageArea
