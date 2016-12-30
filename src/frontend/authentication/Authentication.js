import React, { Component } from 'react'
import { withRouter } from 'react-router'

import Alert from '../common/alert'
import ApiService from '../services/apiService'

class Authentication extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      error: '',
      username: '',
      password: '',
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
        this.props.router.push('/')
      }).catch((error) => {
        this.setState({ error: error.response.data.message || error.message })
      })
  }

  usernameHasBeenInserted() {
    if (this.state.username.trim() === '') {
      this.setState({ error: 'Please insert a username.' })
      return false
    }
    return true
  }

  passwordHasBeenInserted() {
    if (this.state.password.trim() === '') {
      this.setState({ error: 'Please insert a password.' })
      return false
    }
    return true
  }

  render() {
    return (
      <div className="panel">
        <div className="row">
          <div className="col-md-8 col-xs-12">
            <h1 className="panel-heading p-t-0">
              Log in
            </h1>
          </div>
        </div>
        <div className="row-flex">
          <form className="form">
            <div className="form-group">
              <label htmlFor="usernameInput">Insert your username here</label>
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
              <label htmlFor="passwordInput">Insert your password here</label>
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
            {this.state.error ? <div className="m-t-4 m-b-3"><Alert type="danger">{this.state.error}</Alert></div> : ''}
            <div className="form-group">
              <label htmlFor="verificationButton">Press the button below to log in</label>
              <button
                type="submit"
                className="form-control btn btn-primary"
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
