import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BlackCard from '../cards/blackCard'
import WhiteCard from '../cards/whiteCard'
import { selectBestSubmission, initializeRound } from '../actions'
import './Evaluation.scss'
import Footer from '../../common/footer'

function heading(everyoneHasSubmitted, evaluator, bestSubmission) {
  if (everyoneHasSubmitted && evaluator && !bestSubmission) {
    return <h2 className="text-danger">{ 'click on the winning combination to evaluate!' }</h2>
  } else if (everyoneHasSubmitted && evaluator && bestSubmission) {
    return <h2 className="text-info">{ 'waiting for you to start next round...' }</h2>
  } else if (everyoneHasSubmitted && bestSubmission) {
    return <h2 className="text-info">{ 'waiting for the next round...' }</h2>
  } else if (everyoneHasSubmitted) {
    return <h2 className="text-info">{ 'waiting for evaluation...' }</h2>
  }
  return <h2 className="text-info">{ 'waiting for submissions...' }</h2>
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
  shuffledOrder,
}) => {
  const activePlayerCount = Object.keys(players).filter(key => players[key].active).length
  const everyoneHasSubmitted = (
    submittedCards && Object.keys(submittedCards).length >= activePlayerCount - 1
  )
  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }} className="container">
      { heading(everyoneHasSubmitted, evaluator, bestSubmission) }
      <div className="submissions d-flex" style={{ flex: 1 }}>
        <div>
          {
            (everyoneHasSubmitted && shuffledOrder) &&
            shuffledOrder.map((key) => {
              const submitterId = parseInt(key, 10)
              const submitter = submitterId === user.id ? user : users[key]
              return (
                <div // eslint-disable-line
                  className={`submission ${evaluator && 'cursor-pointer'}`}
                  key={key}
                  onClick={() => (
                    (evaluator && !bestSubmission) && onSelectBestSubmission(submitterId)
                  )}
                >
                  <div className={`best-message ${bestSubmission === submitterId}`}>
                    <h1 className="text-danger w-100 text-center">{ 'best' }</h1>
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
      </div>
      <div>
        {
          evaluator && (
            <Footer>
              <button
                className="btn btn-success"
                onClick={onNextRound}
                style={{ width: '143px' }}
              >
                start next round
              </button>
            </Footer>
          )
        }
      </div>
    </div>
  )
}

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
  shuffledOrder: Types.arrayOf(Types.number),
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
  shuffledOrder: null,
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
  shuffledOrder: store.game.shuffledOrder,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSelectBestSubmission: selectBestSubmission,
  onNextRound: initializeRound,
}, dispatch)

export default connect(mapStoreToProps, mapDispatchToProps)(Evaluation)
