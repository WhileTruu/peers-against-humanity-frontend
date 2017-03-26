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
const webSocketService = new WebSocketService('localhost:8080/api/v1/rooms')
const dataChannelService = new DataChannelService()

const devTools = window.devToolsExtension ? window.devToolsExtension() : variable => variable
const finalCreateStore = compose(
  applyMiddleware(thunk, webSocketService.middleware, dataChannelService.middleware), devTools,
)(createStore)
const store = finalCreateStore(rootReducer)

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
