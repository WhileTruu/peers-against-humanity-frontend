import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import LogOutButton from '../common/buttons/logOut'
import LogInButton from '../common/buttons/logIn'

import { actions as authActions } from '../services/authService'

class IndexPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
  }

  componentDidMount() {
    if (window.localStorage.getItem('token')) this.props.dispatch(authActions.isAuthenticated())
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ authenticated: nextProps.auth.isAuthenticated })
  }

  renderAuthenticationButtons() {
    return (
      <div style={{ display: 'inline-flex' }}>
        <div className="m-r-1">
          <LogInButton>Log In</LogInButton>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {this.props.router.push('/users/registration')}}
        >
          Register
        </button>
      </div>
    )
  }

  render() {
    return (
      <div className="panel">
        <div className="row">
          <div className="col-md-8 col-xs-6">
            <h1 className="panel-heading p-t-0 p-b-0">
              Sockets
            </h1>
            <h1 className="panel-heading p-t-0 p-b-0">
              Against
            </h1>
            <h1 className="panel-heading p-t-0">
              Humanity.
            </h1>
            <h3 className="white-text">
            A shitty game for shitty people.
            </h3>
          </div>
          <div className="col-md-4 col-xs-6">
            <div className="right">
              {this.props.auth.isAuthenticated ?
                (<LogOutButton>Log out</LogOutButton>) : this.renderAuthenticationButtons()
              }
            </div>
          </div>
        </div>
        <div className="row-flex">
        </div>
      </div>
    )
  }
}

export default connect(value => value)(withRouter(IndexPage))
