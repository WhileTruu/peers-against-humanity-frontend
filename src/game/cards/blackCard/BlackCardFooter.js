import React, { PropTypes as Types } from 'react'

const BlackCardFooter = ({ pick }) => (
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
      style={{ wordSpacing: '0px', letterSpacing: '0px' }}
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
        { pick || 0 }
      </tspan>
    </text>
  </g>
)

BlackCardFooter.propTypes = {
  pick: Types.number,
}

BlackCardFooter.defaultProps = {
  pick: null,
}

export default BlackCardFooter
