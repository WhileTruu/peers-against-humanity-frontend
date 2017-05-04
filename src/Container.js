import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import FrontPage from './pages/frontPage'
import { LoginForm, RegistrationForm } from './user'
import Rooms from './rooms'
import Game from './game'

const Container = () => (
  <Router>
    <div>
      <div className="boulder-container">
        <img className="boulder-right" src="/boulder1.svg" alt="boulder" />
      </div>
      <div className="boulder-container">
        <img className="boulder-left" src="/boulder2.svg" alt="boulder" />
      </div>
      <div className="container-fluid py-5" style={{ minHeight: '100vh' }}>
        <div className="row">
          <div className="col-12 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
            <Route exact path="/" component={FrontPage} />
            <Route path="/login" component={LoginForm} />
            <Route path="/register" component={RegistrationForm} />
            <Route path="/rooms" component={Rooms} />
            <Route path="/game" component={Game} />
          </div>
        </div>
      </div>
    </div>
  </Router>
)

export default Container
