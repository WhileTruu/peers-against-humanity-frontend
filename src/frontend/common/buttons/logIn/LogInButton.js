import React, { Component, PropTypes as Types } from 'react'
import { withRouter } from 'react-router'
import AuthService from '../../../services/authService'

class LogInButton extends Component {
  logOut() {
    AuthService.logOut();
    this.setState({ activeTrack: null });
    this.props.router.push('/');
  }
  render() {
    return (
      <div>
        <button
          className="btn btn-input-inverse"
          onClick={() => this.logOut()}
        >
          { this.props.children }
        </button>
      </div>
    )
  }
}

LogInButton.propTypes = {
  children: Types.string.isRequired,
}

LogInButton.displayName = 'LogInButton'

export default withRouter(LogInButton)
