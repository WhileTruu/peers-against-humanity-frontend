import React, { PropTypes } from 'react'

const Button = ({ children, id, type, onClick }) => (
  <button
    type="submit"
    className={`form-control btn btn-${type}`}
    id={id}
    onClick={onClick}
  >
    {children}
  </button>
)

Button.propTypes = {
  children: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(
    ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'link'],
  ).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Button
