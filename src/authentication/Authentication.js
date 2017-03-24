import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'

import Alert from '../common/alert'
import FormGroup from '../common/formGroup'
import Button from '../common/formGroup/button'
import ApiService from '../services/apiService'
import errorTypes from '../common/util'

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
      <div>
        <div className="row">
          <div className="col-12">
            <h1 className="panel-heading">Log in</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <form className="form">
              <FormGroup
                htmlFor={'usernameInput'}
                hasWarning={errorType === errorTypes.username}
                labelText={'Insert username here'}
              >
                <input
                  type="text"
                  className="form-control"
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
              </FormGroup>
              <FormGroup
                htmlFor={'passwordInput'}
                hasWarning={errorType === errorTypes.password}
                labelText={'Insert password here'}
              >
                <input
                  type="password"
                  className="form-control"
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
              </FormGroup>
              <FormGroup
                htmlFor={'logInSubmitButton'}
                hasWarning={errorType === errorTypes.submit}
                labelText={'Press the button below to log in'}
              >
                <Button
                  id={'logInSubmitButton'}
                  onClick={this.onSubmit}
                  type={'success'}
                >
                  Log in
                </Button>
              </FormGroup>
              {error ? <div className="pt-3"><Alert type="danger">{error}</Alert></div> : ''}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

Authentication.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

export default withRouter(Authentication)
