import React from 'react'
import { connect } from 'react-redux'
import FrontPage from './pages/frontPage'
// eslint-disable-next-line
const Container = ({ children }) => (
  <div className="pt-3" style={{ minHeight: '100vh' }}>
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          {children || (<FrontPage />)}
        </div>
      </div>
    </div>
  </div>
)



export default connect(value => value)(Container)
