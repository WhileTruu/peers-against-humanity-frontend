import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BlackCard from '../cards/blackCard'
import WhiteCard from '../cards/whiteCard'
import { selectBestSubmission, startRound } from '../actions'

function heading(players, submittedCards, evaluator) {
  const everyoneHasSubmitted = submittedCards &&
    Object.keys(players).length - 1 === Object.keys(submittedCards).length
  if (everyoneHasSubmitted && evaluator) {
    return 'Evaluate!'
  } else if (everyoneHasSubmitted) {
    return 'Waiting for evaluation...'
  }
  return 'Waiting for submissions...'
}

export const Evaluation = ({
  currentBlackCardId,
  whiteCards,
  blackCards,
  evaluator,
  submittedCards,
  onSelectBestSubmission,
  onNextRound,
  players,
}) => (
  <div>
    <h2>{heading(players, submittedCards, evaluator)}</h2>
    <div>
      {/* eslint-disable */}
      {submittedCards && Object.keys(submittedCards).map(key => (
        <div key={key} onClick={() => onSelectBestSubmission(parseInt(key, 10))}>
          <BlackCard
            text={blackCards[currentBlackCardId].text}
            pick={blackCards[currentBlackCardId].pick}
          />
          {
            submittedCards[key].map((id) => (
              <WhiteCard text={whiteCards[id].text} key={id} />
            ))
          }
        </div>
      ))}
      {evaluator && (
        <button className="btn btn-default btn-block" onClick={onNextRound}>
          next round
        </button>
      )}
    </div>
    {/* eslint-enable */}
  </div>
)


Evaluation.propTypes = {
  currentBlackCardId: Types.number,
  whiteCards: Types.shape({}),
  blackCards: Types.shape({}),
  players: Types.shape({}),
  evaluator: Types.bool,
  submittedCards: Types.shape({}),
  onSelectBestSubmission: Types.func,
  onNextRound: Types.func,
}

Evaluation.defaultProps = {
  currentBlackCardId: null,
  whiteCards: null,
  blackCards: null,
  evaluator: null,
  players: null,
  submittedCards: null,
  onSelectBestSubmission: () => null,
  onNextRound: () => null,
}

const mapStoreToProps = store => ({
  evaluator: store.game.evaluatorId === store.user.id,
  submittedCards: store.game.submittedCards,
  currentBlackCardId: store.game.currentBlackCardId,
  whiteCards: store.game.whiteCards,
  blackCards: store.game.blackCards,
  players: store.game.players,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSelectBestSubmission: selectBestSubmission,
  onNextRound: startRound,
}, dispatch)

export default connect(mapStoreToProps, mapDispatchToProps)(Evaluation)
