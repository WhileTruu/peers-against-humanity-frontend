import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import FrontPage from './pages/frontPage'
import { LoginForm, RegistrationForm } from './user'
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
      <div style={{ minHeight: '100vh' }}>
        <Route exact path="/" component={FrontPage} />

        <Route path="/login" component={LoginForm} />
        <Route path="/register" component={RegistrationForm} />
        <Route path="/rooms" component={Rooms} />

      </div>
    </div>
  </Router>
)

export default Container
