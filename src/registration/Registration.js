import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import Alert from '../common/alert'
import ApiService from '../services/apiService'
import { actions as authActions } from '../services/authService'
import errorTypes from '../common/util'

class Registration extends Component {
  constructor(props) {
    super(props)
    this.passwordsAreMatching = this.passwordsAreMatching.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      error: '',
      username: '',
      password: '',
      passwordAgain: '',
      errorType: null,
    }
  }

  onSubmit(event) {
    event.preventDefault()
    if (!this.usernameHasBeenInserted()) return
    if (!this.passwordsAreMatching()) return
    const { username, password } = this.state
    ApiService.registerNewUserAccount(username, password)
      .then((response) => {
        window.localStorage.setItem('token', response.data.token)
        this.props.dispatch(authActions.isAuthenticated())
        this.setState({ error: '', errorType: null })
        this.props.history.push('/')
      }).catch((error) => {
        this.setState({ error: error.message, errorType: errorTypes.submit })
      })
  }

  usernameHasBeenInserted() {
    if (this.state.username.trim() === '') {
      this.setState({ error: 'Please insert a username.', errorType: errorTypes.username })
      return false
    }
    return true
  }

  passwordsAreMatching() {
    if (this.state.password.trim() === '') {
      this.setState({ error: 'Please insert a password.', errorType: errorTypes.password })
      return false
    }
    if (this.state.password === this.state.passwordAgain) return true
    this.setState({ error: 'Passwords do not match.', errorType: errorTypes.password })
    return false
  }

  render() {
    const { error, errorType } = this.state
    return (
      <div className="panel">
        <div className="row">
          <div className="col-12">
            <h1 className="panel-heading">
              Create an account
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <form className="form">
              <div className={`mb-0 pt-3 form-group${errorType === errorTypes.username ? ' has-warning' : ''}`}>
                <label htmlFor="usernameInput" className="form-check-label">
                  Insert a new username below
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg sah-btn-default"
                  id="usernameInput"
                  placeholder="TheLegend27"
                  onChange={(event) => {
                    this.setState({
                      error: '',
                      errorType: null,
                      username: event.target.value,
                    })
                  }}
                />
              </div>
              <div className={`mb-0 pt-3 form-group${errorType === errorTypes.password ? ' has-warning' : ''}`}>
                <label htmlFor="passwordInput" className="form-check-label">
                  Insert password below
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg sah-btn-default"
                  id="passwordInput"
                  placeholder="Password"
                  onChange={(event) => {
                    this.setState({
                      error: '',
                      errorType: null,
                      password: event.target.value,
                    })
                  }}
                />
              </div>
              <div className={`mb-0 pt-3 form-group${errorType === errorTypes.password ? ' has-warning' : ''}`}>
                <label htmlFor="passwordInput2" className="form-check-label">
                  Insert password again
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg sah-btn-default"
                  id="passwordInput2"
                  placeholder="Password"
                  onChange={(event) => {
                    this.setState({
                      error: '',
                      errorType: null,
                      passwordAgain: event.target.value,
                    })
                  }}
                />
              </div>
              {error ? <div className="mt-4 pt-3 mb-0"><Alert type="warning">{error}</Alert></div> : ''}
              <div className={`mb-0 pt-3 form-group${errorType === errorTypes.submit ? ' has-warning' : ''}`}>
                <label htmlFor="registrationButton" className="form-check-label">
                  Press the button below to register
                </label>
                <button
                  type="submit"
                  className="form-control btn sah-btn-primary btn-lg"
                  id="registrationButton"
                  onClick={this.onSubmit}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

Registration.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

export default connect(value => value)(withRouter(Registration))
