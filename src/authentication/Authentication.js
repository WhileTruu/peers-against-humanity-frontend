import React, { Component, PropTypes } from 'react'
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
      .then((response) => {
        window.localStorage.setItem('token', response.data.token)
        this.setState({ error: '', errorType: null })
        this.props.router.push('/')
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
      <div className="panel pt-5">
        <div className="row">
          <div className="col-12">
            <h1 className="panel-heading">Log in</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <form className="form">
              <div className={`mb-0 pt-3 form-group${errorType === errorTypes.username ? ' has-warning' : ''}`}>
                <label
                  htmlFor="usernameInput"
                  className="form-check-label"
                >
                  Insert username here
                </label>
                <input
                  type="text"
                  className="form-control sah-btn-default btn-lg"
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
                <label
                  htmlFor="passwordInput"
                  className="form-check-label"
                >
                  Insert your password here
                </label>
                <input
                  type="password"
                  className="form-control sah-btn-default btn-lg"
                  placeholder="Password"
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
              {error ? <div className="mt-4 pt-3"><Alert type="warning">{error}</Alert></div> : ''}
              <div className={`mb-0 pt-3 form-group${errorType === errorTypes.submit ? ' has-warning' : ''}`}>
                <label
                  htmlFor="verificationButton"
                  className="form-check-label"
                >
                  Press the button below to log in
                </label>
                <button
                  type="submit"
                  className="form-control btn sah-btn-success btn-lg"
                  id="verificationButton"
                  onClick={this.onSubmit}
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

Authentication.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

export default withRouter(Authentication)
