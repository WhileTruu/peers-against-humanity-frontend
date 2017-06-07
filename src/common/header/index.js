import React from 'react'

export default ({ children, navigation, stripes }) => ( // eslint-disable-line react/prop-types
  <header>
    { stripes && <div className="stripes" /> }
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap-reverse">
        { navigation }
      </div>
      { children }
    </div>
  </header>
)
