import React from 'react'
import './Loader.scss'

const Loader = () => (
  <span className="process process-xs">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="uil-balls"><rect x="0" y="0" width="100" height="100" fill="none" className="bk"></rect><g transform="rotate(0 50 50)">
      <circle r="10" cx="10" cy="50">
        <animateTransform attributeName="transform" type="translate" begin="0s" repeatCount="indefinite" dur="1s" values="0 0;59.99999999999999 -34.64101615137755" keyTimes="0;1"/>
        <animate attributeName="fill" dur="1s" begin="0s" repeatCount="indefinite"  keyTimes="0;1" values="#51cacc;#9df871"/>
      </circle>
    </g><g transform="rotate(120 50 50)">
      <circle r="10" cx="10" cy="50">
        <animateTransform attributeName="transform" type="translate" begin="0s" repeatCount="indefinite" dur="1s" values="0 0;59.99999999999999 -34.64101615137755" keyTimes="0;1"/>
        <animate attributeName="fill" dur="1s" begin="0s" repeatCount="indefinite"  keyTimes="0;1" values="#9df871;#e0ff77"/>
      </circle>
    </g><g transform="rotate(240 50 50)">
      <circle r="10" cx="10" cy="50">
        <animateTransform attributeName="transform" type="translate" begin="0s" repeatCount="indefinite" dur="1s" values="0 0;59.99999999999999 -34.64101615137755" keyTimes="0;1"/>
        <animate attributeName="fill" dur="1s" begin="0s" repeatCount="indefinite"  keyTimes="0;1" values="#e0ff77;#51cacc"/>
      </circle>
    </g></svg>
  </span>
);

export default Loader;
