import React, { PropTypes as Types } from 'react'
import { connect } from 'react-redux'

import Main from './main'
import Evaluation from './evaluation'

const Game = ({ isEvaluator, hasSubmitted, roundNumber }) => (
  <div>
    <div className="pt-2">
      {
        roundNumber && <h4 className="text-info">{ `Round ${roundNumber}` }</h4>
      }
    </div>
    { (isEvaluator || hasSubmitted) ? <Evaluation /> : <Main /> }
  </div>
)

Game.propTypes = {
  roundNumber: Types.number,
  hasSubmitted: Types.bool,
  isEvaluator: Types.bool,
}

Game.defaultProps = {
  roundNumber: null,
  hasSubmitted: false,
  isEvaluator: false,
}

const mapStoreToProps = store => ({
  roundNumber: store.game.roundNumber,
  hasSubmitted: store.game.submitted,
  isEvaluator: store.user.id === store.game.evaluatorId,
})

export default connect(mapStoreToProps)(Game)
