import React, { Component } from 'react'
import { withRouter } from 'react-router'

import Alert from '../common/alert'
import ApiService from '../services/apiService'

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
        this.props.router.push('/')
      }).catch((error) => {
        this.setState({ error: error.response.data.message })
      })
  }

  usernameHasBeenInserted() {
    if (this.state.username.trim() === '') {
      this.setState({ error: 'Please insert a username.' })
      return false
    }
    return true
  }

  passwordsAreMatching() {
    if (this.state.password.trim() === '') {
      this.setState({ error: 'Please insert a password.' })
      return false
    }
    if (this.state.password === this.state.passwordAgain) return true
    this.setState({ error: 'Passwords do not match.' })
    return false
  }

  render() {
    return (
      <div className="panel">
        <div className="row">
          <div className="col-md-8 col-xs-12">
            <h1 className="panel-heading p-t-0">
              Create an account
            </h1>
          </div>
        </div>
        <div className="row-flex">
          <form className="form">
            <div className="form-group">
              <label htmlFor="usernameInput">Insert a new username below</label>
              <input
                type="text"
                className="form-control btn-input-inverse"
                id="usernameInput"
                placeholder="TheLegend27"
                onChange={(event) => {
                  this.setState({
                    error: '',
                    username: event.target.value,
                  })
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="passwordInput">Insert password below</label>
              <input
                type="password"
                className="form-control btn-input-inverse"
                id="passwordInput"
                onChange={(event) => {
                  this.setState({
                    error: '',
                    password: event.target.value,
                  })
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="passwordInput2">Insert password again</label>
              <input
                type="password"
                className="form-control btn-input-inverse"
                id="passwordInput2"
                onChange={(event) => {
                  this.setState({
                    error: '',
                    passwordAgain: event.target.value,
                  })
                }}
              />
            </div>
            {this.state.error ? <div className="m-t-4 m-b-3"><Alert type="danger">{this.state.error}</Alert></div> : ''}
            <div className="form-group">
              <label htmlFor="registrationButton">Press the button below to register</label>
              <button
                type="submit"
                className="form-control btn btn-primary"
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

export default withRouter(Registration)
