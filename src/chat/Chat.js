import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import MessageComposer from './messageComposer'
import MessageArea from './messageArea'
import MemberList from '../rooms/room/memberList'

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
      chatSelected: true,
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
    if (!isOpen) document.querySelector('body').classList.add('chat-open')
    else document.querySelector('body').classList.remove('chat-open')
    this.setState({ isOpen: !isOpen })
  }

  render() {
    const { isOpen, chatSelected } = this.state
    return (
      <div>
        <div className="chat-container">
          <div className={`chat-frame ${isOpen ? '' : 'hidden'}`}>
            <div className="boulder-container">
              <img className="boulder-right" src="/boulder4.svg" alt="boulder" />
            </div>
            <div className="boulder-container">
              <img className="boulder-left" src="/boulder3.svg" alt="boulder" />
            </div>
            <div className="chat-components-container">
              <div className="chat-header">
                <button
                  onClick={this.toggleOpen}
                  className="chat-header-button btn btn-outline-danger m-1 p-2"
                  aria-hidden="true"
                >
                  <img style={{ width: '16px', height: '16px' }} src="/closeButton.svg" alt="close" />
                </button>
                <div className="navbar-inverse" style={{ width: '100%' }}>
                  <ul className="chat-navbar navbar-nav">
                    <li className={`chat-nav-item nav-item ${chatSelected && 'active'}`}>
                      <button
                        className="btn-link nav-link"
                        onClick={() => this.setState({ chatSelected: true })}
                      >
                        chat
                      </button>
                    </li>
                    <li className={`chat-nav-item nav-item ${!chatSelected && 'active'}`}>
                      <button
                        className="btn-link nav-link"
                        onClick={() => this.setState({ chatSelected: false })}
                      >
                        members
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {
                chatSelected ? (
                  <div>
                    <MessageArea
                      userId={this.props.userId}
                      messages={this.props.messages}
                      composerHeight={this.state.composerHeight}
                    />
                    <MessageComposer
                      isOpen={isOpen}
                      onSendMessage={this.sendMessage}
                      changeComposerHeight={this.changeComposerHeight}
                    />
                  </div>
                ) : (
                  <div className="chat-member-list">
                    <MemberList
                      userId={this.props.userId}
                      members={{ [this.props.userId]: this.props.user, ...this.props.members }}
                    />
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <button
          className="chat-button btn btn-primary p-2"
          onClick={this.toggleOpen}
          style={{ borderRadius: '50%' }}
        >
          {
            isOpen ? (
              <div style={{ padding: '6px' }}>
                <img style={{ width: '24px', height: '24px' }} src="/closeButton.svg" alt="close" />
              </div>
            ) : (
              <img style={{ width: '36px', height: '36px' }} src="/chat.svg" alt="close" />
            )
          }
        </button>
      </div>
    )
  }
}

Chat.propTypes = {
  user: PropTypes.shape({}),
  userId: PropTypes.number,
  username: PropTypes.string,
  nickname: PropTypes.string,
  messages: PropTypes.array, // eslint-disable-line
  members: PropTypes.shape({}),
  sendMessage: PropTypes.func.isRequired,
}


Chat.defaultProps = {
  user: null,
  userId: null,
  username: null,
  nickname: null,
  messages: null,
  members: null,
}

const mapStoreToProps = store => ({
  userId: store.user.id,
  user: store.user,
  username: store.user.username,
  nickname: store.user.nickname,
  messages: store.chat.messages,
  members: store.dataChannel.users,
})

const mapDispatchToProps = dispatch => ({
  sendMessage: data => dispatch(actions.send(data)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(Chat)
