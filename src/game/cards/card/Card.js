import React, { PropTypes as Types } from 'react'
import './card.scss'

export const Card = ({ children, backgroundColor, foregroundColor, selected, number }) => (
  <div className={`sah-card m-2 ${selected && 'selected'}`} style={{ display: 'inline-flex', maxWidth: '100%', height: '200px' }}>
    { selected && <div className="selected"><h1>{number}</h1></div> }
    <svg
      id="svg2"
      xmlns="http://www.w3.org/2000/svg"
      height="100%"
      version="1.1"
      viewBox="0 0 223.22835 311.81102"
    >
      <g id="layer1" transform="translate(0 -740.55)">
        <rect
          id="rect4136"
          rx="14.173"
          ry="14.173"
          height="311.81"
          width="223.23"
          y="740.55"
          x="0"
          fill={backgroundColor}
        />
        <g id="g4174" transform="translate(0 3.5186)">
          <g id="g4166" transform="matrix(0.5 0 0 0.5 10.63 515.55)">
            <rect
              id="rect4136-9"
              strokeLinejoin="round"
              transform="rotate(-10)"
              rx="1.3056"
              ry="1.3282"
              height="21.252"
              width="15.668"
              stroke={foregroundColor}
              y="998.25"
              x="-154.09"
              strokeWidth="1.0842"
            />
            <rect
              id="rect4136-0"
              transform="rotate(10)"
              rx="1.396"
              ry="1.396"
              height="22.336"
              width="16.752"
              y="984.42"
              x="207.42"
              strokeWidth="1.0842"
              stroke={foregroundColor}
              fill="#fff"
            />
          </g>
          <text id="text4170">
            <tspan
              id="tspan4172"
              fontWeight="600"
              fontSize="7.5px"
              y="1027.9282"
              x="39.524704"
              fontFamily="&apos;Aino&apos;"
              fill={foregroundColor}
            >Peers Against Humanity</tspan>
          </text>
        </g>
        {children}
      </g>
    </svg>
  </div>
)

Card.propTypes = {
  children: Types.oneOfType([Types.arrayOf(Types.node), Types.node]),
  backgroundColor: Types.string,
  foregroundColor: Types.string,
  selected: Types.bool,
  number: Types.number,
}

Card.defaultProps = {
  children: null,
  backgroundColor: '#ffffff',
  foregroundColor: '#000000',
  selected: false,
  number: null,
}

export default Card
