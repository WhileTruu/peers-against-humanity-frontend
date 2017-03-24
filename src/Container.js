import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import FrontPage from './pages/frontPage'
import Authentication from './authentication'
import Registration from './registration'
import Rooms from './rooms'

const Container = () => (
  <Router>
    <div className="container p-5" style={{ minHeight: '100vh' }}>
      <div className="row">
        <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          <Route exact path="/" component={FrontPage} />
          <Route path="/login" component={Authentication} />
          <Route path="/register" component={Registration} />
          <Route path="/rooms" component={Rooms} />
        </div>
      </div>
    </div>
  </Router>
)

export default connect(value => value)(Container)
