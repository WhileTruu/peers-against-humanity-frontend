import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Alert from '../../common/alert'
import { requestLogin } from '../actions'

class Authentication extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onUsernameChange = this.onUsernameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.state = {
      username: null,
      password: null,
      usernameError: false,
      passwordError: false,
    }
  }

  onSubmit(event) {
    event.preventDefault()
    const { username, password, usernameError, passwordError } = this.state
    if (!username) {
      this.setState({ usernameError: true })
      return
    }
    if (!password) {
      this.setState({ passwordError: true })
      return
    }
    if (usernameError || passwordError) {
      return
    }
    this.props.requestLogin({ username, password })
  }

  onPasswordChange(event) {
    const password = event.target.value
    this.setState({ password, passwordError: false })
    if (password.trim() === '') {
      this.setState({ passwordError: true })
    }
  }

  onUsernameChange(event) {
    const username = event.target.value
    this.setState({ username, usernameError: false })
    if (username.trim() === '') {
      this.setState({ usernameError: true })
    }
  }

  render() {
    const { usernameError, passwordError } = this.state
    const { errorStatusCode, isAuthenticated, isFetching, onSuccessRedirectTo } = this.props
    return (
      <div>
        {isAuthenticated ? <Redirect to={onSuccessRedirectTo} /> : ''}
        <h1 className="panel-heading">Log in</h1>
        <form className="form">
          <div className={`form-group ${usernameError ? 'has-warning' : ''}`}>
            <label htmlFor="usernameInput" className="form-check-label">
              Insert username here
            </label>
            <input
              type="text"
              className="form-control"
              id="usernameInput"
              placeholder="TheLegend27"
              onChange={this.onUsernameChange}
            />
          </div>
          <div className={`form-group ${passwordError ? 'has-warning' : ''}`}>
            <label htmlFor="passwordInput" className="form-check-label">
              Insert password here
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              id="passwordInput"
              onChange={this.onPasswordChange}
            />
          </div>
          <div className={`form-group ${usernameError + 3 === 2 ? 'has-warning' : ''}`}>
            <label htmlFor="loginButton" className="form-check-label">
              Press the button below to log in
            </label>
            <button
              type="submit"
              disabled={isFetching}
              className="form-control btn btn-success"
              id="loginButton"
              onClick={this.onSubmit}
            >
              {isFetching ? 'loading...' : 'Log in'}
            </button>
          </div>
          {errorStatusCode ? <div className="pt-3"><Alert type="danger">{errorStatusCode.toString()}</Alert></div> : ''}
        </form>
      </div>
    )
  }
}

Authentication.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  requestLogin: PropTypes.func.isRequired,
  errorStatusCode: PropTypes.number,
  onSuccessRedirectTo: PropTypes.string,
}

Authentication.defaultProps = {
  onSuccessRedirectTo: '/',
  errorStatusCode: null,
}

const mapDispatchToProps = dispatch => ({
  requestLogin: credentials => dispatch(requestLogin(credentials)),
})

const mapStoreToProps = store => ({
  isAuthenticated: store.users.isAuthenticated,
  isFetching: store.users.isFetching,
  errorStatusCode: store.users.errorStatusCode,
})

export default connect(mapStoreToProps, mapDispatchToProps)(Authentication)
