import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import BlackCard from '../game/cards/blackCard'
import WhiteCard from '../game/cards/whiteCard'
import Header from '../common/header'
import { actions as users } from '../user'
import translations from '../translations'
import './index.scss'

const HeaderCards = () => ( // eslint-disable-line
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

const LoginButton = ({ history, strings }) => ( // eslint-disable-line react/prop-types
  <button className="btn btn-link" onClick={() => history.push('/login')}>
    { strings.signIn }
  </button>
)

const RegistrationButton = ({ history, strings }) => ( // eslint-disable-line react/prop-types
  <button className="btn btn-link" onClick={() => history.push('/register')}>
    { strings.register }
  </button>
)


const LogOutButton = ({ logOut, history, strings }) => ( // eslint-disable-line react/prop-types
  <button
    className="btn btn-link"
    onClick={() => {
      logOut()
      history.push('/')
    }}
  >
    { strings.signOut }
  </button>
)

const hasRTCSupport = (
  (window.mozRTCPeerConnection) ||
  (window.RTCPeerConnection) ||
  (window.webkitRTCPeerConnection)
)

const IndexPage = ({ isLoggedIn, isRegistered, history, strings, logOut }) => { // eslint-disable-line
  return (
    <div className="index-page d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Header
        stripes
        navigation={[(
          <h1 key="header" className="panel-heading">peers<br />against<br />humanity</h1>
        ), (
          <div
            key="buttons" className="form-inline justify-content-end align-self-end"
            style={{ flexGrow: 1 }}
          >
            { (isLoggedIn && hasRTCSupport) && LogOutButton({ logOut, history, strings }) }
            { (!isLoggedIn && hasRTCSupport) && LoginButton({ history, strings }) }
            { (!isRegistered && hasRTCSupport) && RegistrationButton({ history, strings }) }
          </div>
        )]}
      >
        <div>
          <div className="py-3">
            <h5 className="pb-2">
              { 'peers against humanity is a card game based on '}
              <a className="btn-link text-yellow" href="https://www.cardsagainsthumanity.com">
                Cards Against Humanity
              </a>
            </h5>
            {
              hasRTCSupport && (
                <div>
                  <button
                    id="roomsButton"
                    className="btn btn-success"
                    onClick={() => history.push('/rooms')}
                  >
                    explore the game rooms
                  </button>
                </div>
              )
            }
          </div>
        </div>
      </Header>
      <div className="content container py-3" style={{ flex: 1 }}>
        <div className="pt-2">
          {
            hasRTCSupport ? (
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
            *according to my little check anyway
          </small>
        </div>
      </div>
      <footer>
        <div className="container py-3">
          <div className="text-center small text-muted">
            <span>
              { strings.licenceText[0] }
              <a className="btn-link" href="https://www.cardsagainsthumanity.com">
                Cards Against Humanity
              </a>
              { strings.licenceText[1] }
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

IndexPage.propTypes = {
  isRegistered: PropTypes.bool,
  isLoggedIn: PropTypes.bool.isRequired,
  logOut: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  strings: PropTypes.shape({}).isRequired,
}

IndexPage.defaultProps = {
  isRegistered: false,
  strings: translations.en,
}

const mapStoreToProps = store => ({
  isLoggedIn: store.user.isLoggedIn,
  isRegistered: store.user.registered,
})

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(users.logOut()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(IndexPage))
