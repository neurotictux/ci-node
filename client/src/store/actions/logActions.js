export const LogActionTypes = {
    APP_START: 'APP_RUN_START',
    APP_DATA: 'APP_RUN_DATA',
    APP_END: 'APP_RUN_END',
    SET_RUNNING: 'SET_RUNNING',
    PUBLISH_START: 'APP_PUBLISH_START',
    PUBLISH_DATA: 'APP_PUBLISH_DATA',
    PUBLISH_END: 'APP_PUBLISH_END',
    PUBLISH_CURRENT_LOG: 'PUBLISH_CURRENT_LOG',
    SET_PUBLISHES: 'SET_PUBLISHES'
}

export const logAppStart = data => ({ type: LogActionTypes.APP_START, payload: data })

export const logAppData = data => ({ type: LogActionTypes.APP_DATA, payload: data })

export const logAppEnd = data => ({ type: LogActionTypes.APP_END, payload: data })

export const setRunning = names => ({ type: LogActionTypes.SET_RUNNING, payload: { names } })

export const logPublishStart = data => ({ type: LogActionTypes.PUBLISH_START, payload: data })

export const logPublishData = data => ({ type: LogActionTypes.PUBLISH_DATA, payload: data })

export const logPublishEnd = data => ({ type: LogActionTypes.PUBLISH_END, payload: data })

export const setPublishCurrentLog = name => ({ type: LogActionTypes.PUBLISH_CURRENT_LOG, payload: { name } })

export const setPublishes = publishes => ({ type: LogActionTypes.SET_PUBLISHES, payload: { publishes } })