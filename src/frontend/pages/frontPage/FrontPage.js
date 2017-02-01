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
    const { isAuthenticated } = this.props.auth
    const { router } = this.props
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
              {isAuthenticated ?
                (<LogOutButton>Log out</LogOutButton>) : this.renderAuthenticationButtons()
              }
            </div>
          </div>
          <div className="col-12">
            <div className="pt-3">
              <h5>{`If you're feeling suicidal you've come to the right place.`}</h5>
            </div>
          </div>
        </div>
        {isAuthenticated ?
          <div className="row">
            <div className="col-12">
              <div className="mb-0 pt-3 form-group">
                <label
                  htmlFor="inputCardText"
                  className="form-check-label"
                >
                  Shitty card maker for shitty people
                </label>
                <button
                  className="form-control btn sah-btn-default btn-lg"
                  onClick={() => {router.push('/cards/new')}}
                >
                  Create a new card
                </button>
              </div>
              <div className="mb-0 pt-3 form-group">
                <label
                  htmlFor="inputCardText"
                  className="form-check-label"
                >
                  Judge cards other people have created!
                </label>
                <button
                  className="form-control btn sah-btn-default btn-lg"
                  onClick={() => {router.push('/cards/evaluation')}}
                >
                  Evaluate cards
                </button>
              </div>
            </div>
          </div>
          : '' }
      </div>
    )
  }
}

export default connect(value => value)(withRouter(FrontPage))
