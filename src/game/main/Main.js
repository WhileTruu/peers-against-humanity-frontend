import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BlackCard from '../cards/blackCard'
import WhiteCard from '../cards/whiteCard'

import { toggleCardSelected } from './actions'
import { submitCards } from '../actions'

export const Main = ({
  blackCards,
  whiteCards,
  currentWhiteCardIds,
  currentBlackCardId,
  selectedCardIds,
  onSubmitCards,
  onToggleCardSelected,
}) => {
  const blackCard = blackCards && blackCards.filter(card => card.id === currentBlackCardId)[0]
  return (
    <div>
      <div className="black-card-container justify-content-center d-flex">
        {
          blackCard &&
          <BlackCard
            text={blackCard.text}
            pick={blackCard.pick}
          />
        }
        {
          // whiteCards &&
          // whiteCards
          //   .filter(whiteCard => selectedCardIds.includes(whiteCard.id))
          //   .sort((x, y) => selectedCardIds.indexOf(x.id) > selectedCardIds.indexOf(y.id))
          //   .map(whiteCard => (
          //     <div key={whiteCard.id}>
          //       <WhiteCard key={whiteCard.id} text={whiteCard.text} />
          //     </div>
          //   ))
        }
      </div>
      <div className="white-card-container justify-content-center d-flex flex-wrap">
        {
          /* eslint-disable */
          (whiteCards && currentWhiteCardIds) &&
          whiteCards
            .filter(whiteCard => currentWhiteCardIds.includes(whiteCard.id))
            .map(whiteCard => (
              <div
                key={whiteCard.id}
                onClick={() => onToggleCardSelected(whiteCard.id, blackCard.pick)}
              >
                <WhiteCard
                  key={whiteCard.id}
                  text={whiteCard.text}
                  number={selectedCardIds && selectedCardIds.indexOf(whiteCard.id) + 1}
                  selected={selectedCardIds && selectedCardIds.includes(whiteCard.id)}
                />
              </div>
            ))
          /* eslint-enable */
        }
      </div>
      <div>
        <button className="btn btn-default btn-block" onClick={onSubmitCards}>
          submit cards
        </button>
      </div>
    </div>
  )
}

Main.propTypes = {
  blackCards: Types.arrayOf(Types.shape({})),
  whiteCards: Types.arrayOf(Types.shape({})),
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
