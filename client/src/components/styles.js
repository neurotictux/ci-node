import styled, { keyframes } from 'styled-components'

export const AppContainer = styled.div`
    background-color: #212121;
`

const Blink = keyframes`
    50% {
    opacity: 0;
  }
`

const ProgressMove = keyframes`
    0% { width: 0px; margin-left: 0px }
    50% { width: 50px; margin-left: 0px }
    100% { width: 50px; margin-left: 100px }
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

export const StatusRunning = styled.div`
    background-color: #97b99f;
    height:4px;
    animation: ${ProgressMove} infinite 1s;
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
    min-width: 800px;
    box-shadow: 0 0 1px white;
    th {
        padding: 10px 20px;
        text-transform: uppercase;
        font-size: 16px;
    }
    td {
        &:not(:last-child) {
            border-right: 1px #666 solid;
        }
        border-top: 1px #666 solid;
        padding: 5px;
        text-align: center;
    }
`

export const DefaultButton = styled.button`
    background-color: #444;
    padding: 6px;
    font-size: 14px;
    border-radius: 4px;
    text-transform: uppercase;
    color: #FFF;
    border: none;
    &:hover {
        opacity: .8;
        cursor: pointer;
        transition: 200ms;
    }
    &:active {
        opacity: .6;
    }
`

export const ActionsButton = styled(DefaultButton)`
`