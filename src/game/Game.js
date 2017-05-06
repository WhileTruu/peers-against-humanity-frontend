import React, { PropTypes as Types } from 'react'
import { connect } from 'react-redux'

import Main from './main'
import Evaluation from './evaluation'

const Game = ({ isEvaluator, hasSubmitted }) => (
  <div>
    { (isEvaluator || hasSubmitted) ? <Evaluation /> : <Main /> }
  </div>
)

Game.propTypes = {
  hasSubmitted: Types.bool,
  isEvaluator: Types.bool,
}

Game.defaultProps = {
  hasSubmitted: false,
  isEvaluator: false,
}

const mapStoreToProps = store => ({
  hasSubmitted: store.game.submitted,
  isEvaluator: store.user.id === store.game.evaluatorId,
})

export default connect(mapStoreToProps)(Game)
