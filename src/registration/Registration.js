import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import FormGroup from '../common/formGroup'
import Button from '../common/formGroup/button'
import Alert from '../common/alert'
import ApiService from '../services/apiService'
import { actions as authenticationActions } from '../authentication'
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
        const { token, id } = response
        this.props.logIn({ token, userId: id, username })
        this.setState({ error: '', errorType: null })
        this.props.history.push('/')
      }).catch((error) => {
        this.setState({ error: error.response.status.toString(), errorType: errorTypes.submit })
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
      <div>
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
              <FormGroup
                htmlFor={'usernameInput'}
                hasWarning={errorType === errorTypes.username}
                labelText={'Insert a new username below'}
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
                labelText={'Insert password below'}
              >
                <input
                  type="password"
                  className="form-control"
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
              </FormGroup>
              <FormGroup
                htmlFor={'passwordInput2'}
                hasWarning={errorType === errorTypes.password}
                labelText={'Insert password again'}
              >
                <input
                  type="password"
                  className="form-control"
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
              </FormGroup>
              <FormGroup
                htmlFor={'registrationSubmitButton'}
                hasWarning={errorType === errorTypes.submit}
                labelText={'Press the button below to register'}
              >
                <Button
                  id={'registrationSubmitButton'}
                  type={'primary'}
                  onClick={this.onSubmit}
                >
                  Register
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

Registration.propTypes = {
  logIn: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

const mapDispatchToProps = dispatch => ({
  logIn: token => dispatch(authenticationActions.logIn(token)),
})


export default connect(value => value, mapDispatchToProps)(withRouter(Registration))
