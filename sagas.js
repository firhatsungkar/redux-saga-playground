import { delay } from 'redux-saga'
import {
  call,
  put,
  takeEvery,
  all,
  takeLatest,
  select,
  take,
  fork,
  cancel,
  cancelled,
  race
} from 'redux-saga/effects'
import { create } from 'apisauce'

const Api = create({
  baseURL: 'https://yesno.wtf',
  Headers: { 'Accept' : 'application/json' }
})

const Auth = create({
  baseURL: 'https://reqres.in/api',
  Headers: { 'Accept': 'application/json'}
})

export function* helloSaga() {
  console.log('Hello Sagas!')
}

export function* incrementAsync() {
  yield call(delay, 1000)
  yield put({ type: 'INCREMENT' })
}

export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

export function* ask() {
  try {
    const answer = yield call(Api.get, '/api')
    yield put({type: 'ASK_SUCCEEDED', answer})
  } catch (error) {
    yield put({type: 'ASK_FAILED', error})
  }
}

export function* authorize(email, password) {
  try {
    const response = yield call(Auth.post, '/login', { email, password })
    const { data: { token } } = response
    yield put({type: 'LOGIN_SUCCESS', token})
    yield put({ type: 'SET_TOKEN', token })
    console.log('New token has been set: ', token)
  } catch(error) {
    yield put({type: 'LOGIN_ERROR', error})
  } finally {
    if (yield cancelled()) {
      console.log('Task canceled!')
    }
  }
}

export function* watchAndLog() {
  while(true) {
    const action = yield take('*')
    const state = yield select()

    console.log('action: ', action)
    console.log('state after: ', state)
  }
}

export function* watchFirstThreeAsk() {
  for (let i = 0; i < 3; i++) {
    const action = yield take('ASK')
    if(2-i != 0) {
      console.log(`Ask ${2-i} question again please...`)
    }
  }

  yield put({type: 'SHOW_CONGRATULATION'})
}

export function* watchAsk() {
  yield takeLatest('ASK', ask)
  yield takeEvery('ASK_SUCCEEDED', ({ type, answer }) => console.log('She answer: ', answer.data.answer ))
  yield takeEvery('ASK_FAILED', (error) => console.error('Error: ', error))
  yield takeEvery('SHOW_CONGRATULATION', () => console.log('Congratulation! You have been asked for three times'))
}

export function* loginFlow() {
  while(true) {
    const { email, password } = yield take('LOGIN')
    yield fork(raceTask); // start the race
    const authTask = yield fork(authorize, email, password)
    const action = yield take(['LOGOUT', 'LOGIN_ERROR'])
    if (action.type === 'LOGOUT')
      yield cancel(authTask)  
    yield put({type: 'SET_TOKEN', token: ''})
    console.log('Token has been flushed!')
  }
}

export function* raceTask() {
  const { taskA, taskB } = yield race({
    taskA: call(delay, 5000),
    taskB: call(delay, 3000)
  })

  if (taskA) {
    console.log('Task A won the race')
  } else {
    console.log('Task B won the race')
  }
}

export default function* rootSaga() {
  // all will parallel the saga
  yield all([
    helloSaga(),
    watchIncrementAsync(),
    watchAsk(),
    // watchAndLog(), // enable this for loging all dispacth event
    watchFirstThreeAsk(),
    loginFlow(),
  ])
}