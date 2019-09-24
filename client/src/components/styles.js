import styled, { keyframes } from 'styled-components'

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
  max-width: 800px;
  resize: none;
  width: 800px;
  height: 400px;
  max-height: 400px;
  margin-bottom: 100px;
  background-color: #282c34;
  color: white;
`