import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'

class LogInButton extends Component {
  logIn() {
    this.props.router.push('/users/authentication')
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
  children: PropTypes.string.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

LogInButton.displayName = 'LogInButton'

export default withRouter(LogInButton)
