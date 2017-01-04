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
      <div className="form-inline">
          <LogInButton>Log In</LogInButton>
          <button
            className="btn btn-primary btn-lg ml-1"
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
          <div className="col-xs-6">
            <h1 className="panel-heading pt-0 pb-0">
              Sockets<br/>Against<br/>Humanity
            </h1>
          </div>
          <div className="col-xs-6">
            <div className="right">
              {this.props.auth.isAuthenticated ?
                (<LogOutButton>Log out</LogOutButton>) : this.renderAuthenticationButtons()
              }
            </div>
          </div>
        </div>
        <div className="row-flex mt-1">
          <h5>
            A shitty game for shitty people.
          </h5>
          <button
            className="form-control mt-1 btn btn-inverse btn-lg"
            onClick={() => {this.props.router.push('/cards/new')}}
          >
            Create a new card
          </button>
          <button
            className="form-control mt-1 btn btn-inverse btn-lg"
            onClick={() => {this.props.router.push('/cards/random')}}
          >
            Check out a random card
          </button>
        </div>
      </div>
    )
  }
}

export default connect(value => value)(withRouter(FrontPage))
