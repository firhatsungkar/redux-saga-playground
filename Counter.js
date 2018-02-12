/*eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react'

const Counter = ({ value, token, onLogin, onLogout, onIncrement, onDecrement, onIncrementAsync, onAsk }) =>
      <div>
        <button onClick={onAsk}>
          Request to yesno.wtf
        </button>
        {' '}
        <button onClick={ Boolean(token) ? onLogout : onLogin }>
          { Boolean(token) ? 'Logout' : 'Login' }
        </button>
        {' '}
        <button onClick={onIncrementAsync}>
          Increment after 1 second
        </button>
        {' '}
        <button onClick={onIncrement}>
          Increment
        </button>
        {' '}
        <button onClick={onDecrement}>
          Decrement
        </button>
        <hr />
        <div>
          Clicked: {value} times
        </div>
      </div>

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired
}

export default Counter
