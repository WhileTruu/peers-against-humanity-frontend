import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import LogOutButton from '../../common/buttons/logOut'
import LogInButton from '../../common/buttons/logIn'

import { actions as authActions } from '../../services/authService'

class FrontPage extends Component {
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
      <div>
          <LogInButton>Log In</LogInButton>
          <button
            className="btn sah-btn-primary btn-lg ml-3"
            onClick={() => {this.props.router.push('/users/registration')}}
          >
            Register
          </button>
      </div>
    )
  }

  render() {
    return (
      <div className="panel pt-5">
        <div className="row">
          <div className="col-6">
            <h1 className="panel-heading">
              Sockets<br/>Against<br/>Humanity
            </h1>
          </div>
          <div className="col-6">
            <div className="form-inline justify-content-end">
              {this.props.auth.isAuthenticated ?
                (<LogOutButton>Log out</LogOutButton>) : this.renderAuthenticationButtons()
              }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="pt-3">
              <h5>A shitty game for shitty people.</h5>
            </div>
            <div className="pt-3">
              <button
                className="form-control btn sah-btn-default btn-lg"
                onClick={() => {this.props.router.push('/cards/new')}}
              >
                Create a new card
              </button>
            </div>
            <div className="pt-3">
              <button
                className="form-control btn sah-btn-default btn-lg"
                onClick={() => {this.props.router.push('/cards/random')}}
              >
                Check out a random card
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(value => value)(withRouter(FrontPage))
