import { LogActionTypes } from '../actions'

const INITIAL_STATE = {
    currentLog: ''
}

export const PublishLogReducer = (state = INITIAL_STATE, action) => {
    const newState = { ...state }
    let lastLog = null
    switch (action.type) {
        case LogActionTypes.PUBLISH_START:
            newState[action.payload.name] = { publishing: true, log: '' }
            newState.currentLog = action.payload.name
            return newState
        case LogActionTypes.PUBLISH_DATA:
            lastLog = newState[action.payload.name]
            if (!lastLog) {
                lastLog = { log: action.payload.log }
                newState[action.payload.name] = lastLog
            } else
                lastLog.log = action.payload.log
            lastLog.publishing = true
            newState.currentLog = action.payload.name
            return newState
        case LogActionTypes.PUBLISH_END:
            lastLog = newState[action.payload.name]
            if (!lastLog) {
                lastLog = {}
                newState[action.payload.name] = lastLog
            }
            lastLog.publishing = false
            return newState
        case LogActionTypes.PUBLISH_CURRENT_LOG:
            newState.currentLog = action.payload.name
            return newState
        case LogActionTypes.SET_PUBLISHES:
            action.payload.publishes.forEach(p => {
                if (!(newState[p.name] || {}).publishing) {
                    if (newState[p.name])
                        newState[p.name].log = p.log
                    else
                        newState[p.name] = { log: p.log }
                }
            })
            return newState
        default:
            return state
    }
}