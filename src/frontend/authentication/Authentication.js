import React, { Component } from 'react'
import { withRouter } from 'react-router'

import Alert from '../common/alert'
import ApiService from '../services/apiService'
import { errorTypes } from '../common/util'

class Authentication extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      error: '',
      username: '',
      password: '',
      errorType: null,
    }
  }

  onSubmit(event) {
    event.preventDefault()
    if (!this.usernameHasBeenInserted()) return
    if (!this.passwordHasBeenInserted()) return
    const { username, password } = this.state
    ApiService.logInWithUserAccount(username, password)
      .then(response => {
        window.localStorage.setItem('token', response.data.token)
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

  passwordHasBeenInserted() {
    if (this.state.password.trim() === '') {
      this.setState({ error: 'Please insert a password.', errorType: errorTypes.password })
      return false
    }
    return true
  }

  render() {
    const { error, errorType } = this.state
    return (
      <div className="panel">
        <div className="row">
          <div className="col-md-8 col-xs-12">
            <h1 className="panel-heading">
              Log in
            </h1>
          </div>
        </div>
        <div className="row-flex">
          <form className="form">
            <div className={`form-group${errorType === errorTypes.username ? ' has-warning' : ''}`}>
              <label
                htmlFor="usernameInput"
                className="form-check-label"
              >
                Insert username here
              </label>
              <input
                type="text"
                className="form-control btn-inverse btn-lg"
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
              <label
                htmlFor="passwordInput"
                className="form-check-label"
              >
                Insert your password here
              </label>
              <input
                type="password"
                className="form-control btn-inverse btn-lg"
                id="passwordInput"
                onChange={(event) => {
                  this.setState({
                    error: '',
                    errorType: null,
                    password: event.target.value,
                  })
                }}
              />
            </div>
            {error ? <div className="mt-3 mb-2"><Alert type="warning">{error}</Alert></div> : ''}
            <div className={`form-group${errorType === errorTypes.submit ? ' has-warning' : ''}`}>
              <label
                htmlFor="verificationButton"
                className="form-check-label"
              >
                Press the button below to log in
              </label>
              <button
                type="submit"
                className="form-control btn btn-primary btn-lg"
                id="verificationButton"
                onClick={this.onSubmit}
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(Authentication)
