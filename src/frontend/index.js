import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'

import NewCardForm from './cards/new'
import Container from './Container'
import Registration from './registration'
import './index.scss'

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Container}>
      <IndexRedirect to="cards/new" />
      <Route path="cards">
        <Route path="new" component={NewCardForm} />
      </Route>
      <Route path="users">
        <Route path="registration" component={Registration} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('root'), // eslint-disable-line
)
