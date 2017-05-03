import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { actions as users } from '../../user'

class FrontPage extends Component {
  logOut() {
    this.props.logOut()
    this.props.history.push('/')
  }

  renderLoginButton() {
    const { history } = this.props
    return (
      <div>
        <button className="btn btn-success mb-3" onClick={() => history.push('/login')}>
          log in
        </button>
      </div>
    )
  }

  renderRegistrationButton() {
    const { history } = this.props
    return (
      <div>
        <button className="btn btn-primary mb-3 ml-3" onClick={() => history.push('/register')}>
          register
        </button>
      </div>
    )
  }

  renderLogOutButton() {
    return (
      <div>
        <button className="btn btn-info mb-3" onClick={() => this.logOut()}>
          log out
        </button>
      </div>
    )
  }

  render() {
    const { isLoggedIn, isRegistered, history } = this.props
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <h1 className="panel-heading">
              peers<br />against<br />humanity
            </h1>
          </div>
          <div className="col-6">
            <div className="form-inline justify-content-end">
              {isLoggedIn ? this.renderLogOutButton() : this.renderLoginButton()}
              {!isRegistered && this.renderRegistrationButton()}
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <h5>{"if you're feeling suicidal you've come to the right place"}</h5>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="roomsButton" className="form-check-label">
                join a game
              </label>
              <button
                id="roomsButton"
                className="form-control btn btn-success"
                onClick={() => history.push('/rooms')}
              >
                available rooms
              </button>
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
