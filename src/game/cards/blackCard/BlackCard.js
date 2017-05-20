import React, { PropTypes as Types } from 'react'

import Card from '../card'
import BlackCardFooter from './BlackCardFooter'
import CardText from '../cardText'

const BlackCard = ({ text, pick }) => (
  <Card backgroundColor={'#000000'} foregroundColor={'#ffffff'}>
    <CardText text={text} color={'#ffffff'} />
    <BlackCardFooter pick={pick} />
  </Card>
)

BlackCard.propTypes = {
  text: Types.string,
  pick: Types.number,
}

BlackCard.defaultProps = {
  text: null,
  pick: null,
}

export default BlackCard
