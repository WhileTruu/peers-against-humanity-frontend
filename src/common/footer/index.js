import React from 'react'

export default ({ children }) => ( // eslint-disable-line react/prop-types
  <footer>
    <div className="container py-3">
      <div className="d-flex justify-content-center align-items-center flex-wrap-reverse">
        { children }
      </div>
    </div>
  </footer>
)
