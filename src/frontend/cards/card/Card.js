import React, { Component, PropTypes } from 'react'
import './card.scss'

export default class Card extends Component {
  constructor() {
    super()
    this.colors = { white: 'white', black: 'black' }
  }

  footer() {
    const { color, pick } = this.props
    if (color === this.colors.white) return ''
    return (
      <g>
        <circle
          id="path4136-0-5"
          cx="198.33"
          cy="1028.3"
          r="8.4787"
          fill="#ffffff"
        />
        <text
          id="text4193"
          style={{ wordSpacing: "0px", letterSpacing: "0px" }}
          fontSize="12.5px"
          y="1034.4406"
          x="142.36111"
          fontFamily="sans-serif"
          fill="#000000"
        >
          <tspan
            id="tspan4195"
            fontWeight="bold"
            fontSize="17.5px"
            y="1034.4406"
            x="142.36111"
            fontFamily="&apos;Nunito Sans&apos;"
            fill="#ffffff"
          >
            PICK
          </tspan>
        </text>
        <text id="text4207">
          <tspan
            id="tspan4209"
            fontWeight="bold"
            fontSize="18px"
            y="1034.5"
            x="193"
            fill="#000000"
            fontFamily="&apos;Nunito Sans&apos;"
          >
            {pick}
          </tspan>
        </text>
      </g>
    )
  }

  render() {
    const { color, text } = this.props
    const backgroundColor = color === this.colors.white ? '#ffffff' : '#000000'
    const foregroundColor = color === this.colors.white ? '#000000' : '#ffffff'

    return (
      <div>
        <svg id="svg2" xmlns="http://www.w3.org/2000/svg" height="88mm" width="63mm" version="1.1" viewBox="0 0 223.22835 311.81102">
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
                  fontFamily="&apos;Nunito Sans&apos;"
                  fill={foregroundColor}
                >Sockets Against Humanity</tspan>
              </text>
            </g>
            {color === this.colors.white ? '' : this.footer()}
            <foreignObject
              id="tspan4232"
              fontWeight="600"
              fontSize="18px"
              y="752.64"
              x="18.09"
              height="260"
              width="187.05"
              fontFamily="&apos;Nunito Sans&apos;"
              fill="#ffffff"
              style={{ wordSpacing: "0px", letterSpacing: "0px" }}
            >
               <div style={{ color: foregroundColor }} xmlns="http://www.w3.org/1999/xhtml">
                  {text}
               </div>
            </foreignObject>
          </g>
        </svg>
      </div>
    )
  }
}

Card.propTypes = {
  color: PropTypes.oneOf(['black', 'white']),
  pick: PropTypes.number,
  text: PropTypes.string.isRequired,
}

Card.defaultProps = {
  color: 'white',
  pick: 1,
  text: 'Gay aliens.',
}
