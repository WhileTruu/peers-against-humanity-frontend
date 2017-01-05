import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import Alert from '../common/alert'
import ApiService from '../services/apiService'
import { actions as authActions } from '../services/authService'
import { errorTypes } from '../common/util'

class Registration extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
  }
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
      .then(response => {
        window.localStorage.setItem('token', response.data.token)
        this.props.dispatch(authActions.isAuthenticated())
        this.setState({ error: '', errorType: null })
        this.props.router.push('/')
      }).catch((error) => {
        this.setState({ error: error.response.data.message || error.message, errorType: errorTypes.submit })
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
          <div className="col-xs-12">
            <h1 className="panel-heading">
              Create an account
            </h1>
          </div>
        </div>
        <div className="row-flex">
          <form className="form">
            <div className={`form-group${errorType === errorTypes.username ? ' has-warning' : ''}`}>
              <label htmlFor="usernameInput" className="form-check-label">Insert a new username below</label>
              <input
                type="text"
                className="form-control form-control-lg btn-inverse"
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
            <div className={`form-group${errorType === errorTypes.password ? ' has-warning' : ''}`}>
              <label htmlFor="passwordInput" className="form-check-label">Insert password below</label>
              <input
                type="password"
                className="form-control form-control-lg btn-inverse"
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
            <div className={`form-group${errorType === errorTypes.password ? ' has-warning' : ''}`}>
              <label htmlFor="passwordInput2" className="form-check-label">Insert password again</label>
              <input
                type="password"
                className="form-control form-control-lg btn-inverse"
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
            {error ? <div className="mt-3 mb-2"><Alert type="warning">{error}</Alert></div> : ''}
            <div className={`form-group${errorType === errorTypes.submit ? ' has-warning' : ''}`}>
              <label htmlFor="registrationButton" className="form-check-label">Press the button below to register</label>
              <button
                type="submit"
                className="form-control btn btn-primary btn-lg"
                id="registrationButton"
                onClick={this.onSubmit}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default connect(value => value)(withRouter(Registration))
