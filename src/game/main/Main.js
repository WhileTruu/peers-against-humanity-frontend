import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BlackCard from '../cards/blackCard'
import WhiteCard from '../cards/whiteCard'
import Footer from '../../common/footer'

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
}) => {
  /* eslint-disable */
  const renderWhiteCards = () => (currentWhiteCardIds
    .map(id => (
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
  )
    /* eslint-enable */
  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <div
        className="main"
        style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}
      >
        <div className="justify-content-center d-flex">
          {
            (blackCards !== null && currentBlackCardId !== null) &&
            <BlackCard
              text={blackCards[currentBlackCardId].text}
              pick={blackCards[currentBlackCardId].pick}
            />
          }
        </div>

        <div className="white-card-container-singleline">
          <div className="white-card-container">
            { (whiteCards && currentWhiteCardIds) && renderWhiteCards() }
          </div>
        </div>

        <div className="white-card-container-multiline">
          <div className="white-card-container">
            { (whiteCards && currentWhiteCardIds) && renderWhiteCards().slice(0, 5) }
          </div>
          <div className="white-card-container">
            { (whiteCards && currentWhiteCardIds) && renderWhiteCards().slice(5) }
          </div>
        </div>
      </div>
      <Footer>
        <button
          className="btn btn-success"
          onClick={onSubmitCards}
          style={{ width: '143px' }}
        >
          submit cards
        </button>
      </Footer>
    </div>
  )
}


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
