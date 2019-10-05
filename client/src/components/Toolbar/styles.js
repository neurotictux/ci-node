import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-direction: column;
    height: 80px;
    background-color: #333;
    box-shadow: 5px 5px 5px black;
    overflow: hidden;
    span {
        font-size: 30px;
        font-weight: bold;
        color: white;
    }
`