import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import BlackCard from '../../game/cards/blackCard'
import WhiteCard from '../../game/cards/whiteCard'
import { actions as users } from '../../user'
import './FrontPage.scss'

class FrontPage extends Component {
  logOut() {
    this.props.logOut()
    this.props.history.push('/')
  }

  renderLoginButton() {
    const { history } = this.props
    return (
      <button
        className="btn btn-link"
        onClick={() => history.push('/login')}
      >
        sign in
      </button>
    )
  }

  renderRegistrationButton() {
    const { history } = this.props
    return (
      <button
        className="btn btn-link"
        onClick={() => history.push('/register')}
      >
        register
      </button>
    )
  }

  renderLogOutButton() {
    return (
      <button
        className="btn btn-link"
        onClick={() => this.logOut()}
      >
        sign out
      </button>
    )
  }

  render() {
    const { isLoggedIn, isRegistered, history } = this.props
    const renderHeaderCards = () => ( // eslint-disable-line
      <div className="header-cards container">
        <BlackCard
          text={
            `In a world ravaged by the violation of our most basic human rights,
            our only solace is _.`
          }
          pick={2}
        />
        <WhiteCard text="The cool, refreshing taste of Pepsi." />
      </div>
    )
    return (
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <div className="header">
          <div className="container">
            { /* renderHeaderCards() */ }
            <div className="d-flex justify-content-between align-items-end flex-wrap-reverse">
              <h1 className="panel-heading">
                peers<br />against<br />humanity
              </h1>
              <div className="form-inline justify-content-end" style={{ flexGrow: 1 }}>
                {isLoggedIn ? this.renderLogOutButton() : this.renderLoginButton()}
                {!isRegistered && this.renderRegistrationButton()}
              </div>
            </div>
            <div>
              <div className="py-3">
                <h5 className="pb-2">
                  { 'peers against humanity is a card game based on '}
                  <a className="btn-link text-warning" href="https://www.cardsagainsthumanity.com">
                    Cards Against Humanity
                  </a>
                </h5>
                <div>
                  <button
                    id="roomsButton"
                    className="btn btn-success"
                    onClick={() => history.push('/rooms')}
                  >
                    explore the game rooms
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content container py-3" style={{ flex: 1 }}>
          <div className="pt-2">
            {
              ((window.mozRTCPeerConnection) ||
              (window.RTCPeerConnection) ||
              (window.webkitRTCPeerConnection)) ? (
                <h5>
                  {'your browser '}
                  <span className="text-success">
                    supports WebRTC*
                  </span>
                  {', feel free to mess around'}
                </h5>
              ) : (
                <h5 className="text-danger">
                  {'your browser '}
                  <span className="text-success">
                    does not support WebRTC*
                  </span>
                  {', git gud browser'}
                </h5>
              )
            }
            <small className="text-muted">
              *who am I to judge browser support, go ahead and try anyway
            </small>
          </div>
        </div>
        <footer className="footer">
          <div className="container py-3">
            <div className="text-center small text-muted">
              <span>
                {
                  `
                    peers against humanity is a
                    web application based on
                  `
                }
                <a className="btn-link" href="https://www.cardsagainsthumanity.com">
                  Cards Against Humanity
                </a>
                {
                  `, which is CC licensed (BY-NC-SA).
                    The app was created as part of a bachelor's thesis.
                    peers against humanity is not affiliated with
                    Cards Against Humanity in any way.`
                }
              </span>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

FrontPage.propTypes = {
  isRegistered: PropTypes.bool,
  isLoggedIn: PropTypes.bool.isRequired,
  logOut: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
}

FrontPage.defaultProps = {
  isRegistered: false,
}

const mapStoreToProps = store => ({
  isLoggedIn: store.user.isLoggedIn,
  isRegistered: store.user.registered,
})

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(users.logOut()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(FrontPage))
