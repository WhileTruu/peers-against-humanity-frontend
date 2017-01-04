import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import AuthService from '../../../services/authService'
import { actions as authActions } from '../../../services/authService'

class LogOutButton extends Component {
  logOut() {
    AuthService.logOut();
    this.props.dispatch(authActions.isNotAuthenticated())
    this.props.router.push('/');
  }
  render() {
    return (
      <div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => this.logOut()}
        >
          { this.props.children }
        </button>
      </div>
    )
  }
}

LogOutButton.propTypes = {
  children: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}

LogOutButton.displayName = 'LogOutButton'

export default connect(value => value)(withRouter(LogOutButton))
