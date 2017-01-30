import React, { PropTypes as Types } from 'react';

const Option = ({ label, note, secondary, icon }) => {
  const iconClass = `icon ${icon} mr-2`;
  return (
    <span>
      {icon ? <div className={iconClass} /> : ''}
      {label}
      {note ? <span className="small ml-2">{note}</span> : ''}
      {secondary ? <span className="small text-ellipsis">{secondary}</span> : ''}
    </span>
  );
};

Option.propTypes = {
  label: Types.string.isRequired,
  note: Types.string,
  secondary: Types.string,
  icon: Types.string,
};

export default Option;
