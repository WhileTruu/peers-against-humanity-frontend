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
}) => {
  const blackCard = blackCards && blackCards.filter(card => card.id === currentBlackCardId)[0]
  return (
    <div>
      <h2>{heading(players, submittedCards, evaluator)}</h2>
      <div>
        {submittedCards && Object.keys(submittedCards).map(key => (
          /* eslint-disable */
          <div key={key} onClick={() => onSelectBestSubmission(parseInt(key, 10))}>
            <BlackCard text={blackCard.text} pick={blackCard.pick} />
            {submittedCards[key].map((id) => {
              const card = whiteCards.reduce((accumulator, current) => {
                if (current.id === id) {
                  return current
                }
                return accumulator
              }, null)
              return <WhiteCard text={card.text} key={card.id} />
            })}
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
}

Evaluation.propTypes = {
  currentBlackCardId: Types.number,
  whiteCards: Types.arrayOf(Types.shape({})),
  blackCards: Types.arrayOf(Types.shape({})),
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
