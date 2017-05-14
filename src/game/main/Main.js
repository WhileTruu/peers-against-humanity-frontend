import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BlackCard from '../cards/blackCard'
import WhiteCard from '../cards/whiteCard'

import { toggleCardSelected } from './actions'
import { submitCards } from '../actions'

import './Main.scss'

export const Main = ({
  blackCards,
  whiteCards,
  currentWhiteCardIds,
  currentBlackCardId,
  selectedCardIds,
  onSubmitCards,
  onToggleCardSelected,
}) => (
  <div className="main">
    <div className="black-card-container justify-content-center d-flex">
      {
        (blackCards !== null && currentBlackCardId !== null) &&
        <BlackCard
          text={blackCards[currentBlackCardId].text}
          pick={blackCards[currentBlackCardId].pick}
        />
      }
    </div>
    <div className="white-card-container">
      {
        /* eslint-disable */
        (whiteCards && currentWhiteCardIds) &&
        currentWhiteCardIds.map(id => (
          <div
            key={id}
            onClick={() => onToggleCardSelected(id, blackCards[currentBlackCardId].pick)}
          >
            <WhiteCard
              text={whiteCards[id].text}
              number={selectedCardIds && selectedCardIds.indexOf(id) + 1}
              selected={selectedCardIds && selectedCardIds.includes(id)}
            />
          </div>
        ))
        /* eslint-enable */
      }
    </div>
    <div className="container">
      <button className="btn btn-success mt-2 mb-5 btn-block" onClick={onSubmitCards}>
        submit cards
      </button>
    </div>
  </div>
)


Main.propTypes = {
  blackCards: Types.shape({}),
  whiteCards: Types.shape({}),
  currentWhiteCardIds: Types.arrayOf(Types.number),
  currentBlackCardId: Types.number,

  selectedCardIds: Types.arrayOf(Types.number),
  onToggleCardSelected: Types.func,
  onSubmitCards: Types.func,
}

Main.defaultProps = {
  currentWhiteCardIds: null,
  currentBlackCardId: null,
  blackCards: null,
  whiteCards: null,
  selectedCardIds: [],
  onSubmitCards: () => null,
  onToggleCardSelected: () => null,
}

const mapStoreToProps = store => ({
  blackCards: store.game.blackCards,
  whiteCards: store.game.whiteCards,
  currentWhiteCardIds: store.game.currentWhiteCardIds,
  currentBlackCardId: store.game.currentBlackCardId,
  selectedCardIds: store.gameMain.selectedCardIds,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onToggleCardSelected: toggleCardSelected,
  onSubmitCards: submitCards,
}, dispatch)

export default connect(mapStoreToProps, mapDispatchToProps)(Main)
