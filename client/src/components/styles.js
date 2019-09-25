import styled, { keyframes } from 'styled-components'

export const AppContainer = styled.div`
    background-color: #282c34;
`

const Blink = keyframes`
    50% {
    opacity: 0;
  }
`

const Status = styled.span`
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: solid #FFF 1px;
`

export const StatusContainer = styled.div`
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
`

export const StatusProcessing = styled(Status)`
    background-color: yellow;
    animation: ${Blink} infinite linear 1s;
`

export const StatusError = styled(Status)`
    background-color: red;
`

export const StatusOk = styled(Status)`
    background-color: #28a745;
`

export const LogArea = styled.textarea`
  font-size: 12px;
  resize: none;
  width: 800px;
  height: 400px;
  background-color: #282c34;
  color: white;
`

export const Table = styled.table`
    border: 1px white solid;
    min-width: 800px;
    box-shadow: 0 0 1px white;
    td, th {
        border: 1px white solid;
        padding: 5px;
        text-align: center;
    }
`