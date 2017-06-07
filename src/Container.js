import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Index from './indexPage'
import { LoginForm, RegistrationForm } from './user'
import Rooms from './rooms'
import Test from './test'


const Registration = () => (
  <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-xl-4 offset-xl-4 py-5">
    <RegistrationForm />
  </div>
)

const Login = () => (
  <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-xl-4 offset-xl-4 py-5">
    <LoginForm />
  </div>
)

const hasRTCSupport = (
  (window.mozRTCPeerConnection) ||
  (window.RTCPeerConnection) ||
  (window.webkitRTCPeerConnection)
)


const Container = () => (
  <Router>
    <div>
      {
        /*
        <div className="boulder-container">
          <img className="boulder-right" src="/boulder1.svg" alt="boulder" />
        </div>
        <div className="boulder-container">
          <img className="boulder-left" src="/boulder2.svg" alt="boulder" />
        </div>
        */
      }
      <div style={{ minHeight: '100vh' }}>
        <Route exact path="/" component={Index} />
        {
          hasRTCSupport && (
            <div>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Registration} />
              <Route path="/rooms" component={Rooms} />
              <Route path="/test" component={Test} />
            </div>
          )
        }
      </div>
    </div>
  </Router>
)

export default Container
