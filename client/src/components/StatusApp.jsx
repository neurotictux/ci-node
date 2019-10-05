import React from 'react'
import { StatusContainer, StatusError, StatusOk, StatusProcessing } from './styles'

export const StatusApp = {
    ERROR: 1,
    PROCESSING: 2,
    OK: 3,
    RUNNING: 4
}

export const StatusComponent = ({ status }) => {
    let Status = null
    switch (status) {
        case StatusApp.OK:
            Status = StatusOk
            break
        case StatusApp.PROCESSING:
            Status = StatusProcessing
            break
        default:
            Status = StatusError
            break
    }

    return (
        <StatusContainer>
            <Status />
        </StatusContainer>
    )
}