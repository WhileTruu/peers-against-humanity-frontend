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
      <div>
        <button className="btn btn-success mb-3 btn-link" onClick={() => history.push('/login')}>
          sign in
        </button>
      </div>
    )
  }

  renderRegistrationButton() {
    const { history } = this.props
    return (
      <div>
        <button className="btn btn-primary mb-3 ml-3 btn-link" onClick={() => history.push('/register')}>
          register
        </button>
      </div>
    )
  }

  renderLogOutButton() {
    return (
      <div>
        <button className="btn btn-info mb-3 btn-link" onClick={() => this.logOut()}>
          sign out
        </button>
      </div>
    )
  }

  render() {
    const { isLoggedIn, isRegistered, history } = this.props
    return (
      <div>
        <div className="header">
          <div className="container">
            <div className="header-cards">
              <BlackCard
                text={
                  `In a world ravaged by the violation of our most basic human rights,
                  our only solace is _.`
                }
                pick={2}
              />
              <WhiteCard text="The cool, refreshing taste of Pepsi." />
            </div>
            <div className="row">
              <div className="col-12">
                <div
                  className="d-flex justify-content-between align-items-end"
                  style={{ flexWrap: 'wrap-reverse' }}
                >
                  <h1 className="panel-heading">
                    peers<br />against<br />humanity
                  </h1>
                  <div className="form-inline justify-content-end" style={{ flexGrow: 1 }}>
                    {isLoggedIn ? this.renderLogOutButton() : this.renderLoginButton()}
                    {!isRegistered && this.renderRegistrationButton()}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="py-3">
                  {/* <h5>{"if you're feeling suicidal you've come to the right place"}</h5> */}
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
        </div>
        <div className="footer">
          <div className="container">
            <div className="row text-center">
              <p className="col-12 py-3">{
                `
                  peers against humanity is a prototype
                  application based on Cards Against Humanity
                  and created as part of a bachelor's thesis.
                  The game is based on the Cards Against Humanity card game,
                  which is CC licensed (BY-NC-SA).
                  peers against humanity is not affiliated with
                  Cards Against Humanity in any way.
                `}
              </p>
            </div>
          </div>
        </div>
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
