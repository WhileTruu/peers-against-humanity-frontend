import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import NewCardForm from './cards/new'
import Container from './Container'
import Registration from './registration'
import IndexPage from './indexPage'
import rootReducer from './rootReducer'
import './index.scss'

const devTools = window.devToolsExtension ? window.devToolsExtension() : (variable) => variable
const finalCreateStore = compose(applyMiddleware(thunk), devTools)(createStore)
const store = finalCreateStore(rootReducer)

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Container}>
        <IndexRedirect to="index" />
        <Route path="cards">
          <Route path="new" component={NewCardForm} />
        </Route>
        <Route path="users">
          <Route path="registration" component={Registration} />
        </Route>
        <Route path="index" component={IndexPage} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root'), // eslint-disable-line
)
