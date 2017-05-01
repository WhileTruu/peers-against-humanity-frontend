import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { actions as users } from '../../user'

class FrontPage extends Component {
  logOut() {
    this.props.logOut()
    this.props.history.push('/')
  }

  renderAuthenticationButtons() {
    const { history } = this.props
    return (
      <div className="form-inline justify-content-end">
        <button className="btn btn-success mb-3" onClick={() => history.push('/login')}>
          log in
        </button>
        <button className="btn btn-primary mb-3 ml-3" onClick={() => history.push('/register')}>
          register
        </button>
      </div>
    )
  }

  renderLogOutButton() {
    return (
      <div className="form-inline justify-content-end">
        <button className="btn btn-primary" onClick={() => this.logOut()}>
          log out
        </button>
      </div>
    )
  }

  render() {
    const { isLoggedIn } = this.props
    const { history } = this.props
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <h1 className="panel-heading">
              peers<br />against<br />humanity
            </h1>
          </div>
          <div className="col-6">
            {isLoggedIn ? this.renderLogOutButton() : this.renderAuthenticationButtons()}
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
  isLoggedIn: PropTypes.bool.isRequired,
  logOut: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
}

const mapStoreToProps = store => ({
  isLoggedIn: store.user.isLoggedIn,
})

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(users.logOut()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(FrontPage))
