import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import { dataChannelMiddleware } from './common/dataChannel'
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

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? // eslint-disable-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ // eslint-disable-line no-underscore-dangle
       // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose

const enhancer = composeEnhancers(
  applyMiddleware(crashReporter, thunk, socketMiddleware, dataChannelMiddleware),
)

const store = createStore(rootReducer, enhancer)

ReactDOM.render(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.getElementById('root'),
)
