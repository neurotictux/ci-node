import { LogActionTypes } from '../actions'

const INITIAL_STATE = {}

export const PublishLogReducer = (state = INITIAL_STATE, action) => {
    const newState = { ...state }
    let lastLog = null
    switch (action.type) {
        case LogActionTypes.PUBLISH_START:
            newState[action.payload.name] = { running: true, log: '' }
            return newState
        case LogActionTypes.PUBLISH_DATA:
            lastLog = newState[action.payload.name]
            if (!lastLog) {
                lastLog = { log: action.payload.log }
                newState[action.payload.name] = lastLog
            }
            lastLog.running = true
            return newState
        case LogActionTypes.PUBLISH_END:
            lastLog = newState[action.payload.name]
            if (!lastLog) {
                lastLog = {}
                newState[action.payload.name] = lastLog
            }
            lastLog.running = false
            return newState
        default:
            return state
    }
}