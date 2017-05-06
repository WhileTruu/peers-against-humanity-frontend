import React, { PropTypes as Types } from 'react'

function createMarkup(text) {
  return { __html: text }
}

const CardText = ({ text, color }) => (
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
    style={{ wordSpacing: '0px', letterSpacing: '0px' }}
  >
    <div
      style={{ color }} xmlns="http://www.w3.org/1999/xhtml"
      dangerouslySetInnerHTML={createMarkup(text)}
    />
  </foreignObject>
)

CardText.propTypes = {
  text: Types.string,
  color: Types.string,
}

CardText.defaultProps = {
  text: '',
  color: '#000000',
}

export default CardText
