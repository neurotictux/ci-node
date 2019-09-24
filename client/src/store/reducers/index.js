import { combineReducers } from 'redux'
import { RunningLogReducer } from './runningLogReducer'
import { PublishLogReducer } from './publishLogReducer'

export default combineReducers({
    runningLogState: RunningLogReducer,
    publishLogState: PublishLogReducer,
})