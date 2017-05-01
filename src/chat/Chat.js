import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import MessageComposer from './messageComposer'
import MessageArea from './messageArea'
import { actions } from '.'
import './Chat.scss'

class Chat extends Component {
  constructor(props) {
    super(props)
    this.changeComposerHeight = this.changeComposerHeight.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.toggleOpen = this.toggleOpen.bind(this)
    this.state = {
      composerHeight: null,
      isOpen: false,
    }
  }

  changeComposerHeight(composerHeight) {
    this.setState({ composerHeight })
  }

  sendMessage(text) {
    if (text === '') return
    this.props.sendMessage({
      text,
      timestamp: new Date().getTime(), // eslint-disable-line
      userId: this.props.userId,
      username: this.props.username,
      nickname: this.props.nickname,
    })
  }

  toggleOpen() {
    const { isOpen } = this.state
    if (!isOpen) document.querySelector('body').classList.add('modal-open')
    else document.querySelector('body').classList.remove('modal-open')
    this.setState({ isOpen: !isOpen })
  }

  render() {
    return (
      <div>
        <div className="chat-container">
          <div className={`chat-frame ${this.state.isOpen ? '' : 'hidden'}`}>
            <div className="boulder-container">
              <img className="boulder-right" src="/boulder4.svg" alt="boulder" />
            </div>
            <div className="boulder-container">
              <img className="boulder-left" src="/boulder3.svg" alt="boulder" />
            </div>
            <div className="chat-components-container">
              <div className="chat-header">
                <button className="btn btn-danger chat-header-button" onClick={this.toggleOpen}>
                  close
                </button>
              </div>
              <MessageArea
                userId={this.props.userId}
                messages={this.props.messages}
                composerHeight={this.state.composerHeight}
              />
              <MessageComposer
                isOpen={this.state.isOpen}
                onSendMessage={this.sendMessage}
                changeComposerHeight={this.changeComposerHeight}
              />
            </div>
          </div>
        </div>
        <button className="chat-button btn btn-primary" onClick={this.toggleOpen}>
          chat over webRTC
        </button>
      </div>
    )
  }
}

Chat.propTypes = {
  userId: PropTypes.number,
  username: PropTypes.string,
  nickname: PropTypes.string,
  messages: PropTypes.array, // eslint-disable-line
  sendMessage: PropTypes.func.isRequired,
}


Chat.defaultProps = {
  userId: null,
  username: null,
  nickname: null,
  messages: null,
}

const mapStoreToProps = store => ({
  userId: store.user.user.id,
  username: store.user.user.username,
  nickname: store.user.user.nickname,
  messages: store.chat.messages,
})

const mapDispatchToProps = dispatch => ({
  sendMessage: data => dispatch(actions.sendMessage(data)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(Chat)
