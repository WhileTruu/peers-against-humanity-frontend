import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import Evaluation from './evaluation'
import Main from './main'
import { getCards, startRound } from './actions'

export const Game = ({
  onGetCards,
  onStartRound,
  currentBlackCard,
  currentWhiteCards,
}) => (
  <div>
    <button
      className="btn btn-outline-primary"
      onClick={() => onGetCards(10, 100)}
    >
      get cards
    </button>
    <button
      className="btn btn-outline-success"
      onClick={onStartRound}
    >
      start round
    </button>
    <Main blackCard={currentBlackCard} whiteCards={currentWhiteCards} />
  </div>
)

Game.propTypes = {
  currentBlackCard: Types.shape({}),
  currentWhiteCards: Types.arrayOf(Types.shape({})),
  onGetCards: Types.func,
  onStartRound: Types.func,
}

Game.defaultProps = {
  currentBlackCard: null,
  currentWhiteCards: null,
  onGetCards: () => null,
  onStartRound: () => null,
}

const mapStoreToProps = store => ({
  currentBlackCard: store.game.currentBlackCard,
  currentWhiteCards: store.game.currentWhiteCards,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onGetCards: getCards,
  onStartRound: startRound,
}, dispatch)

export default connect(mapStoreToProps, mapDispatchToProps)(Game)
