import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import NewCardForm from './cards/new'
import RandomCard from './cards/random'
import Container from './Container'
import Registration from './registration'
import Authentication from './authentication'
import rootReducer from './rootReducer'
import './index.scss'

const devTools = window.devToolsExtension ? window.devToolsExtension() : (variable) => variable
const finalCreateStore = compose(applyMiddleware(thunk), devTools)(createStore)
const store = finalCreateStore(rootReducer)

function requireAccess() {
  if (!store.getState().auth.isAuthenticated) {
    browserHistory.push('/')
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Container}>
        <Route path="cards">
          <Route path="new" component={NewCardForm} onEnter={requireAccess} />
          <Route path="random" component={RandomCard} onEnter={requireAccess} />
        </Route>
        <Route path="users">
          <Route path="registration" component={Registration} />
          <Route path="authentication" component={Authentication} />
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root'), // eslint-disable-line
)
