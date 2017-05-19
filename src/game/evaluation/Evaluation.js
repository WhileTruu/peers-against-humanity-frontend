import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BlackCard from '../cards/blackCard'
import WhiteCard from '../cards/whiteCard'
import { selectBestSubmission, initializeRound } from '../actions'
import './Evaluation.scss'

function heading(players, submittedCards, evaluator) {
  const everyoneHasSubmitted = submittedCards &&
    Object.keys(players).length - 1 === Object.keys(submittedCards).length
  if (everyoneHasSubmitted && evaluator) {
    return <h2 className="text-danger">{ 'Evaluate!' }</h2>
  } else if (everyoneHasSubmitted) {
    return <h2 className="text-info">{ 'Waiting for evaluation...' }</h2>
  }
  return <h2 className="text-info">{ 'Waiting for submissions...' }</h2>
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
  users,
  user,
  bestSubmission,
}) => (
  <div className="container">
    { heading(players, submittedCards, evaluator) }
    <div className="submissions d-flex">
      {
        submittedCards && Object.keys(submittedCards).map((key) => {
          const submitterId = parseInt(key, 10)
          const submitter = submitterId === user.id ? user : users[key]
          return (
            <div // eslint-disable-line
              className={`submission ${evaluator && 'cursor-pointer'}`}
              key={key}
              onClick={() => evaluator && onSelectBestSubmission(submitterId)}
            >
              <div className={`winner-message ${bestSubmission === submitterId}`}>
                <h1 className="text-danger w-100 text-center">Winner</h1>
                <h4 className="text-warning w-100 text-center">
                  { submitter && (submitter.username || submitter.nickname) }
                </h4>
              </div>
              <BlackCard
                text={blackCards[currentBlackCardId].text}
                pick={blackCards[currentBlackCardId].pick}
              />
              {
                submittedCards[key].map(id => (
                  <WhiteCard text={whiteCards[id].text} key={id} />
                ))
              }
            </div>
          )
        })
      }
    </div>
    <div>
      {
        evaluator && (
          <div className="container text-center">
            <button
              className="btn btn-success mt-2 mb-5"
              onClick={onNextRound}
              style={{ width: '143px' }}
            >
              next round
            </button>
          </div>
        )
      }
    </div>
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
  bestSubmission: Types.number,
  users: Types.shape({}),
  user: Types.shape({}),
}

Evaluation.defaultProps = {
  user: null,
  currentBlackCardId: null,
  whiteCards: null,
  blackCards: null,
  evaluator: null,
  players: null,
  submittedCards: null,
  bestSubmission: null,
  users: null,
  onSelectBestSubmission: () => null,
  onNextRound: () => null,
}

const mapStoreToProps = store => ({
  user: store.user,
  evaluator: store.game.evaluatorId === store.user.id,
  submittedCards: store.game.submittedCards,
  currentBlackCardId: store.game.currentBlackCardId,
  whiteCards: store.game.whiteCards,
  blackCards: store.game.blackCards,
  players: store.game.players,
  bestSubmission: store.game.bestSubmission,
  users: store.dataChannel.users,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSelectBestSubmission: selectBestSubmission,
  onNextRound: initializeRound,
}, dispatch)

export default connect(mapStoreToProps, mapDispatchToProps)(Evaluation)
