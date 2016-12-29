import React, { Component, PropTypes as Types } from 'react'
import { withRouter } from 'react-router'
import AuthService from '../../../services/authService'

class LogOutButton extends Component {
  logOut() {
    AuthService.logOut();
    this.setState({ activeTrack: null });
    this.props.router.push('/');
  }
  render() {
    return (
      <div>
        <button
          className="btn btn-primary"
          onClick={() => this.logOut()}
        >
          { this.props.children }
        </button>
      </div>
    )
  }
}

LogOutButton.propTypes = {
  children: Types.string.isRequired,
}

LogOutButton.displayName = 'LogOutButton'

export default withRouter(LogOutButton)
