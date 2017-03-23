import React, { PropTypes } from 'react'


function renderLabel(labelText, htmlFor) {
  const label = (
    <label htmlFor={htmlFor} className="form-check-label">
      {labelText}
    </label>
  )
  return labelText.length ? label : ''
}

const FormGroup = ({ children, hasWarning, labelText, htmlFor }) => (
  <div className={`form-group ${hasWarning ? 'has-warning' : ''}`}>
    {renderLabel(labelText, htmlFor)}
    {children}
  </div>
)

FormGroup.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  hasWarning: PropTypes.bool.isRequired,
  labelText: PropTypes.string,
  children: PropTypes.element.isRequired,
}

FormGroup.defaultProps = {
  labelText: '',
}

export default FormGroup
