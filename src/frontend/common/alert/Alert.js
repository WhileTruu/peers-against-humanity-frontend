import React, { PropTypes as Types } from 'react'

const Alert = ({ type, children }) => (
  <div className={`alert m-b-0 alert-${type}`}>
    <strong>{children}</strong>
  </div>
)

Alert.propTypes = {
  type: Types.oneOf(['warning', 'danger', 'info', 'success']).isRequired,
  children: Types.string.isRequired,
}

Alert.displayName = 'Alert'

export default Alert
