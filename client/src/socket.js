import openSocket from 'socket.io-client'

export const LogType = {
    AppStart: 'APP_RUN_START',
    AppData: 'APP_RUN_DATA',
    AppEnd: 'APP_RUN_END',
    PublishStart: 'APP_PUBLISH_START',
    PublishData: 'APP_PUBLISH_DATA',
    PublishEnd: 'APP_PUBLISH_END',
}

const socket = openSocket('http://localhost:8000')

export const Socket = socket