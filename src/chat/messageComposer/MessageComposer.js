import React, { Component, PropTypes } from 'react'

import './MessageComposer.scss'

class MessageComposer extends Component {
  constructor(props) {
    super(props)
    this.onMessageChange = this.onMessageChange.bind(this)
    this.state = {
      message: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen) setTimeout(() => this.textInput.focus(), 0)
  }

  onMessageChange(message) {
    this.setState({ message })
    this.textInput.style.height = 'auto'
    this.textInput.style.height = `${Math.min(this.textInput.scrollHeight, 150) + 2}px`
    this.textInput.scrollTop = this.textInput.scrollHeight
    this.props.changeComposerHeight(this.textInput.scrollHeight)
    // TODO: See if this actually solves a potential page scrolling problem with a lot of text.
    // Might not even appear in our case due to the limited textarea height.
    window.scrollTo(window.scrollLeft, (this.textInput.scrollTop + this.textInput.scrollHeight))
  }

  render() {
    return (
      <div className="input-group message-composer-input-group">
        <textarea
          type="text"
          className="form-control message-composer-input p-3"
          rows="1"
          ref={(input) => { this.textInput = input }}
          placeholder="Send a message..."
          onChange={event => this.onMessageChange(event.target.value)}
        />
        <span className="input-group-btn">
          <button
            className="btn btn-primary message-composer-input-group-btn"
            type="button"
            onClick={() => {
              this.props.onSendMessage(this.state.message)
              this.textInput.value = ''
              this.onMessageChange('')
            }}
          >
            Send!
          </button>
        </span>
      </div>
    )
  }
}

MessageComposer.propTypes = {
  changeComposerHeight: PropTypes.func.isRequired,
  // HACK: for whatever reason eslint is not ok with
  // me having and not having this propType for nextProp
  isOpen: PropTypes.bool.isRequired, // eslint-disable-line react/no-unused-prop-types
  onSendMessage: PropTypes.func.isRequired,
}

export default MessageComposer
