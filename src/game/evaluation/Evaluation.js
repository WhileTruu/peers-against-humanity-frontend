import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { pickCardCombination } from './actions'

export const Evaluation = ({
  evaluator,
  submittedCards,
}) => (
  <div>
    {evaluator ? 'Evaluate!' : 'Wait for eval'}
    {JSON.toString(submittedCards)}
  </div>
)

Evaluation.propTypes = {
  evaluator: Types.number,
  submittedCards: Types.shape({}),
}

Evaluation.defaultProps = {
  evaluator: null,
  submittedCards: null,
}

const mapStoreToProps = store => ({
  evaluator: store.evaluation.evaluator,
  submittedCards: store.evaluation.submittedCards,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  pickCardCombination,
}, dispatch)

export default connect(mapStoreToProps, mapDispatchToProps)(Evaluation)
