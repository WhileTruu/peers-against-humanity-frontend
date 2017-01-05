import React, { PropTypes as Types } from 'react';

const Option = ({ currency, label, note, secondary, icon }) => {
  const iconClass = currency ?
    `currency-flag currency-flag-${currency} pull-xs-0 mr-1` :
    `icon ${icon} pull-xs-0 mr-1`;
  return (
    <span>
      {icon || currency ? <div className={iconClass} /> : ''}
      {label}
      {note ? <span className="small ml-1">{note}</span> : ''}
      {secondary ? <span className="small text-ellipsis">{secondary}</span> : ''}
    </span>
  );
};

Option.propTypes = {
  label: Types.string.isRequired,
  currency: Types.string,
  note: Types.string,
  secondary: Types.string,
  icon: Types.string,
};

export default Option;
