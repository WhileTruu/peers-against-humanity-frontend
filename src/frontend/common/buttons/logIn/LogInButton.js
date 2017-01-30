import React, { Component, PropTypes as Types } from 'react'
import { withRouter } from 'react-router'

class LogInButton extends Component {
  logIn() {
    this.props.router.push('/users/authentication');
  }
  render() {
    return (
      <div style={{ display: 'inline' }}>
        <button
          className="btn sah-btn-success btn-lg"
          onClick={() => this.logIn()}
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
