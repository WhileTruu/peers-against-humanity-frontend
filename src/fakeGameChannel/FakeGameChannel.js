import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { startGame } from './actions'

const FakeGameChannel = () => (
  <div>
    Helo
  </div>
)

FakeGameChannel.propTypes = {
  onStartGame: Types.func,
}

FakeGameChannel.defaultProps = {
  onStartGame: () => null,
}

const mapStoreToProps = () => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onStartGame: startGame,
}, dispatch)

export default connect(mapStoreToProps, mapDispatchToProps)(FakeGameChannel)
