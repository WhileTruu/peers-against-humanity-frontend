import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BlackCard from '../cards/blackCard'
import WhiteCard from '../cards/whiteCard'

import { toggleCardSelected } from './actions'

export const Main = ({
  blackCard,
  whiteCards,
  selectedCardIds,
  onSubmit,
  onToggleCardSelected,
}) => (
  <div>
    <div className="black-card-container justify-content-center d-flex">
      {
        blackCard &&
        <BlackCard text={blackCard.text} pick={blackCard.pick} />
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
        whiteCards &&
        whiteCards.map(whiteCard => (
          <div key={whiteCard.id} onClick={() => onToggleCardSelected(whiteCard.id)}>
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
      <button className="btn btn-default btn-block" onClick={onSubmit}>
        submit cards
      </button>
    </div>
  </div>
)

Main.propTypes = {
  blackCard: Types.shape({}),
  whiteCards: Types.arrayOf(Types.shape({})),
  selectedCardIds: Types.arrayOf(Types.number),
  onToggleCardSelected: Types.func,
  onSubmit: Types.func,
}

Main.defaultProps = {
  blackCard: null,
  whiteCards: null,
  selectedCardIds: [],
  onSubmit: () => null,
  onToggleCardSelected: () => null,
}

const mapStoreToProps = store => ({
  blackCard: store.game.currentBlackCard,
  whiteCards: store.game.currentWhiteCards,
  selectedCardIds: store.gameMain.selectedCardIds,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onToggleCardSelected: toggleCardSelected,
}, dispatch)

export default connect(mapStoreToProps, mapDispatchToProps)(Main)
