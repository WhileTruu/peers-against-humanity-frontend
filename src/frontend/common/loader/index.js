import React from 'react';

const Loader = () => (
  <span className="process process-xs">
    <span className="process-icon-container">
      <span className="process-icon-horizontal"/>
      <span className="process-icon-vertical" />
    </span>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle className="process-circle" cx="50%" cy="50%" fillOpacity="0.0" r="45%" />
    </svg>
  </span>
);

export default Loader;
