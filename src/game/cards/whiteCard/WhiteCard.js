import React, { PropTypes as Types } from 'react'

import Card from '../card'
import CardText from '../cardText'

const WhiteCard = ({ number, selected, text }) => (
  <Card number={number} selected={selected} backgroundColor={'#ffffff'} foregroundColor={'#000000'}>
    <CardText text={text} color={'#000000'} />
  </Card>
)

WhiteCard.propTypes = {
  number: Types.number,
  selected: Types.bool,
  text: Types.string,
}

WhiteCard.defaultProps = {
  number: null,
  selected: false,
  text: null,
}

export default WhiteCard
