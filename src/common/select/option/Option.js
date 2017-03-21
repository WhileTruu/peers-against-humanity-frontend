import React, { PropTypes } from 'react'

const Option = ({ label, note, secondary, icon }) => {
  const iconClass = `icon ${icon} mr-2`
  return (
    <span>
      {icon ? <div className={iconClass} /> : ''}
      {label}
      {note ? <span className="small ml-2">{note}</span> : ''}
      {secondary ? <span className="small text-ellipsis">{secondary}</span> : ''}
    </span>
  )
}

Option.propTypes = {
  label: PropTypes.string.isRequired,
  note: PropTypes.string,
  secondary: PropTypes.string,
  icon: PropTypes.string,
}

Option.defaultProps = {
  note: null,
  secondary: null,
  icon: null,
}

export default Option
