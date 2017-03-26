import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { actions as webSocketActions } from '../services/webSocket'
import { actions as dataChannelActions } from '../services/webRTCDataChannel'

class Rooms extends Component {
  constructor(props) {
    super(props)
    this.state = {
      myId: 1,
      peerId: 2,
      recipientId: 2,
      message: '',
      receivedMessages: [],
      userId: null,
    }
  }

  componentDidMount() {
    this.props.connectWebSocket()
  }

  componentWillUnmount() {
    this.props.closeSocketConnection()
  }

  render() {
    const {
      requestNewPeerConnection,
      socketIsOpen,
    } = this.props
    return (
      <div>
        <h3>SOCKET IS {socketIsOpen ? 'OPEN' : 'CLOSED'}</h3>
        <div className="py-5">
          <form className="form">
            <div className="form-group mr-sm-3">
              <label htmlFor="myIdInput" className="">My id</label>
              <input
                className="form-control"
                id="myIdInput"
                placeholder="My id"
                value={this.state.myId}
                onChange={event => this.setState({ myId: event.target.value })}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.initializeWebRTCDataChannelService}
            >
              Confirm
            </button>
          </form>
          <form className="form pt-sm-3">
            <div className="form-group mr-sm-3">
              <label htmlFor="peerIdInput" className="">Peer id</label>
              <input
                className="form-control"
                id="peerIdInput"
                placeholder="Peer id"
                value={this.state.peerId}
                onChange={event => this.setState({ peerId: event.target.value })}
              />
            </div>
            <div className="form-group mr-sm-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => requestNewPeerConnection(this.state.peerId)}
              >
                Connect
              </button>
            </div>
          </form>
          <form className="form pt-sm-3">
            <div className="form-group mr-sm-3">
              <label htmlFor="messageInput" className="">Message</label>
              <input
                className="form-control"
                id="messageInput"
                value={this.state.message}
                onChange={event => this.setState({ message: event.target.value })}
                placeholder="Message"
              />
            </div>
            <div className="form-group mr-sm-3">
              <label
                htmlFor="messageRecipientIdInput"
                className="sr-only"
              >
                Recipient id
              </label>
              <input
                className="form-control"
                id="messageRecipientIdInput"
                placeholder="Recipient id"
                value={this.state.recipientId}
                onChange={event => this.setState({ recipientId: event.target.value })}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.sendMessage}
            >
              Confirm
            </button>
          </form>
          <div className="pt-5">
            {this.state.receivedMessages.map(message => (
              <p key={`${1}${message.data}`}>{message.data}</p>
            ))}
          </div>
        </div>
        <div className="App-footer container-fluid">
          <div className="row">
            <div className="col-6">
              {this.state.peerConnection !== ({}) ? (<h3>Connections</h3>) : ''}
              {Object.entries(this.props.peerConnections).map(([key, value]) => (
                <div className="pb-3" style={{ textAlign: 'left' }} key={key}>
                  <h4>{key}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>data channel ready state:</div>
                    <div style={{ color: 'tomato' }}>{value.dataChannel.readyState}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>ice connection state:</div>
                    <div style={{ color: 'tomato' }}>{value.peerConnection.signalingState}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>ice gathering state:</div>
                    <div style={{ color: 'tomato' }}>{value.peerConnection.signalingState}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>connection signaling state:</div>
                    <div style={{ color: 'tomato' }}>{value.peerConnection.signalingState}</div>
                  </div>
                </div>
             ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Rooms.propTypes = {
  connectWebSocket: PropTypes.func.isRequired,
  closeSocketConnection: PropTypes.func.isRequired,
  requestNewPeerConnection: PropTypes.func.isRequired,
  peerConnections: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  socketIsOpen: PropTypes.bool.isRequired,
}

const mapStoreToProps = store => ({
  peerConnections: store.dataChannel.peerConnections,
  socketIsOpen: store.socketService.isOpen,
})


const mapDispatchToProps = dispatch => ({
  connectWebSocket: () => dispatch(webSocketActions.connectWebSocket()),
  closeSocketConnection: () => dispatch(webSocketActions.closeSocketConnection()),
  requestNewPeerConnection: peerId => dispatch(dataChannelActions.requestNewPeerConnection(peerId)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(Rooms)
