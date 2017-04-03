import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import WebSocketService from './services/webSocket'
import DataChannelService from './services/webRTCDataChannel'
import Container from './Container'
import rootReducer from './rootReducer'
import './index.scss'

// Subscribe my websocket service to the changes in store
const dataChannelService = new DataChannelService()

const devTools = window.devToolsExtension ? window.devToolsExtension() : variable => variable
const finalCreateStore = compose(
  applyMiddleware(thunk, dataChannelService.middleware), devTools,
)(createStore)
const store = finalCreateStore(rootReducer)

WebSocketService.dispatch = store.dispatch

ReactDOM.render(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.getElementById('root'),
)

/*
ROUTE PLAN
  /
    cards/
      new/
      evaluation/
    users/
      registration/
      authentication/
    rooms/
*/
