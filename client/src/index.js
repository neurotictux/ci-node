import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css';
import App from './App'

import Store from './store'

class Root extends React.Component {
    render() {
        return (
            <Provider store={Store}>
                <App />
            </Provider>
        )
    }
}

ReactDOM.render(<Root />, document.getElementById('root'))