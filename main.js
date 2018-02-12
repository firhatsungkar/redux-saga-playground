import "babel-polyfill"

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import Counter from './Counter'
// import reducer from './reducers'
import reducer from './store/'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

const action = type => store.dispatch({type})

const getState = reducer => store.getState()[reducer]

const credentials = {
  email: 'peter@klaven',
  password: 'cityslicka'
}

function render() {
  ReactDOM.render(
    <Counter
      value={getState('counter')}
      token={getState('token')}
      onLogin={() => store.dispatch({ type: 'LOGIN', ...credentials })}
      onLogout={() => action('LOGOUT')}
      onAsk={() => action('ASK')}
      onIncrementAsync={() => action('INCREMENT_ASYNC')}
      onIncrement={() => action('INCREMENT')}
      onDecrement={() => action('DECREMENT')} />,
    document.getElementById('root')
  )
}

render()
store.subscribe(render)