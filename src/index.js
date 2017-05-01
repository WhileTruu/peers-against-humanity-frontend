import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import DataChannelService from './common/RTCDataChannel'
import { socketMiddleware } from './common/socket'
import Container from './Container'
import rootReducer from './rootReducer'
import './index.scss'

const crashReporter = () => next => (action) => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err) // eslint-disable-line
    throw err
  }
}

const devTools = window.devToolsExtension ? window.devToolsExtension() : variable => variable
const finalCreateStore = compose(
  applyMiddleware(crashReporter, thunk, socketMiddleware), devTools,
)(createStore)
const store = finalCreateStore(rootReducer)

DataChannelService.dispatch = store.dispatch
DataChannelService.getState = store.getState

ReactDOM.render(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.getElementById('root'),
)
