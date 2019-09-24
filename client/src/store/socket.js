import openSocket from 'socket.io-client'
import {
    LogActionTypes,
    logAppStart,
    logAppData,
    logAppEnd,
    logPublishData,
    logPublishEnd,
    logPublishStart
} from './actions'

const socket = openSocket('http://localhost:8000')

export const configure = dispatch => {
    socket.on(LogActionTypes.APP_START, data => dispatch(logAppStart(data)))
    socket.on(LogActionTypes.APP_DATA, data => dispatch(logAppData(data)))
    socket.on(LogActionTypes.APP_END, data => dispatch(logAppEnd(data)))
    socket.on(LogActionTypes.PUBLISH_START, data => dispatch(logPublishStart(data)))
    socket.on(LogActionTypes.PUBLISH_DATA, data => dispatch(logPublishData(data)))
    socket.on(LogActionTypes.PUBLISH_END, data => dispatch(logPublishEnd(data)))
}