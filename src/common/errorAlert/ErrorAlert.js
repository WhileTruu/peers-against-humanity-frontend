import React, { PropTypes as Types } from 'react'

const ErrorAlert = ({ error }) => (
  <div className="alert alert-danger">
    <strong>{error}</strong>
  </div>
)

ErrorAlert.defaultProps = {
  overlayed: false,
}

ErrorAlert.propTypes = {
  error: Types.string.isRequired,
}

export default ErrorAlert
