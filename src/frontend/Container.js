import React from 'react'

// eslint-disable-next-line
const Container = ({ children }) => (
  <div className="bg-sah-default p-t-4" style={{ minHeight: '100vh' }}>
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          {children}
        </div>
      </div>
    </div>
  </div>
)

export default Container
