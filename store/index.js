import { combineReducers } from 'redux'
import counter from './counter_reducer'
import token from './token_reducer'

export default combineReducers({
  counter,
  token
}); 