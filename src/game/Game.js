import React, { PropTypes as Types } from 'react'
import { connect } from 'react-redux'

import Main from './main'
import Evaluation from './evaluation'

import BlackCard from './cards/blackCard'
import WhiteCard from './cards/whiteCard'

import './Game.scss'

const mapWinnerScreenStoreToProps = store => ({
  submittedCards: store.game.submittedCards,
  currentBlackCardId: store.game.currentBlackCardId,
  whiteCards: store.game.whiteCards,
  blackCards: store.game.blackCards,
  users: store.dataChannel.users,
  user: store.user,
})


const WinnerScreen = connect(mapWinnerScreenStoreToProps)(({
  submittedCards,
  winner,
  blackCards,
  whiteCards,
  users,
  currentBlackCardId,
  user,
}) => {
  const submitter = users[winner] || (user.id === winner && user)
  return (
    <div style={{ position: 'relative' }}>
      <div className="container w-100 h-100" style={{ position: 'absolute', overflowX: 'hidden' }}>
        <img className="winner-boulder" alt="winner-boulder" src="/boulder1.svg" />
        <div className={'winner-message'}>
          <h1 className="text-danger w-100 text-center">{ 'winner' }</h1>
          <h1 className="text-info w-100 text-center">
            { submitter && (submitter.username || submitter.nickname) }
          </h1>
        </div>
      </div>
      <div className="winning-cards">
        <BlackCard
          text={blackCards[currentBlackCardId].text}
          pick={blackCards[currentBlackCardId].pick}
        />
        {
          submittedCards[winner].map(id => (
            <WhiteCard text={whiteCards[id].text} key={id} />
          ))
        }
      </div>
    </div>
  )
})

WinnerScreen.propTypes = {
  currentBlackCardId: Types.number,
  whiteCards: Types.shape({}),
  blackCards: Types.shape({}),
  submittedCards: Types.shape({}),
  users: Types.shape({}),
  winner: Types.number,
  user: Types.shape({}),
}

WinnerScreen.defaultProps = {
  winner: null,
  currentBlackCardId: null,
  whiteCards: null,
  blackCards: null,
  submittedCards: null,
  users: null,
  user: null,
}

const Game = ({ isEvaluator, hasSubmitted, roundNumber, finished, winner }) => (
  <div>
    <div className="container">
      <div className="pt-2">
        {
          roundNumber && <h4 className="text-info">{ `round ${roundNumber}` }</h4>
        }
      </div>
    </div>
    {
      !finished &&
      ((isEvaluator || hasSubmitted) ? <Evaluation /> : <Main />)
    }
    {
      finished &&
      <WinnerScreen winner={winner} />
    }
  </div>
)

Game.propTypes = {
  roundNumber: Types.number,
  hasSubmitted: Types.bool,
  isEvaluator: Types.bool,
  finished: Types.bool,
  winner: Types.number,
}

Game.defaultProps = {
  roundNumber: null,
  hasSubmitted: false,
  isEvaluator: false,
  finished: false,
  winner: null,
}

const mapStoreToProps = store => ({
  roundNumber: store.game.roundNumber,
  hasSubmitted: store.game.submitted,
  isEvaluator: store.user.id === store.game.evaluatorId,
  finished: store.game.finished,
  winner: store.game.winner,
})

export default connect(mapStoreToProps)(Game)
