import { LogActionTypes } from '../actions'

const INITIAL_STATE = {}

export const RunningLogReducer = (state = INITIAL_STATE, action) => {
    const newState = { ...state }
    let lastLog = null
    switch (action.type) {
        case LogActionTypes.APP_START:
            newState[action.payload.name] = { running: true, log: '' }
            return newState
        case LogActionTypes.APP_DATA:
            lastLog = newState[action.payload.name]
            if (!lastLog) {
                lastLog = { log: action.payload.log }
                newState[action.payload.name] = lastLog
            } else
                lastLog.log = action.payload.log
            lastLog.running = true
            return newState
        case LogActionTypes.APP_END:
            lastLog = newState[action.payload.name]
            if (!lastLog) {
                lastLog = {}
                newState[action.payload.name] = lastLog
            }
            lastLog.running = false
            return newState
        case LogActionTypes.SET_RUNNING:
            action.payload.names.forEach(p => {
                if (newState[p])
                    newState[p].running = true
                else
                    newState[p] = { running: true }
            })
            return newState
        default:
            return state
    }
}