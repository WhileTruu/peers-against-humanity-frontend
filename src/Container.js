import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import FrontPage from './pages/frontPage'
import { LoginForm, Registration } from './user'
import Rooms from './rooms'

const Container = () => (
  <Router>
    <div>
      <div className="boulder-container">
        <img className="boulder-right" src="/boulder1.svg" alt="boulder" />
      </div>
      <div className="boulder-container">
        <img className="boulder-left" src="/boulder2.svg" alt="boulder" />
      </div>
      <div className="container py-5" style={{ minHeight: '100vh' }}>
        <div className="row">
          <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
            <Route exact path="/" component={FrontPage} />
            <Route path="/login" component={LoginForm} />
            <Route path="/register" component={Registration} />
            <Route path="/rooms" component={Rooms} />
          </div>
        </div>
      </div>
    </div>
  </Router>
)

export default Container
