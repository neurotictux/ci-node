import { createStore, compose } from 'redux'

import { configure } from './socket'
import Reducers from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
    Reducers,
    composeEnhancers()
)

configure(store.dispatch)

export default store