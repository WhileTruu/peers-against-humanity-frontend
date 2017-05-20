import React from 'react'
import './Loader.scss'

const Loader = () => (
  <div className="loader-container d-flex justify-content-center">
    <img className="loader-image" src="/boulder1.svg" alt="boulder" />
    <div className="loader-text-container">
      <h2 className="loader-text text-primary">Loading...</h2>
    </div>
  </div>
)

export default Loader
