import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import FrontPage from './pages/frontPage'
import { actions, Authentication, Registration } from './users'
import Rooms from './rooms'

class Container extends Component {
  componentDidMount() {
    this.props.checkRememberedLogin()
  }

  render() {
    return (
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
                <Route path="/login" component={Authentication} />
                <Route path="/register" component={Registration} />
                <Route path="/rooms" component={Rooms} />
              </div>
            </div>
          </div>
        </div>
      </Router>
    )
  }
}

Container.propTypes = {
  checkRememberedLogin: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  checkRememberedLogin: () => dispatch(actions.checkRememberedLogin()),
})

export default connect(value => value, mapDispatchToProps)(Container)
