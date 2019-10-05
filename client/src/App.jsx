import React from 'react'
import { Provider } from 'react-redux'

import { Home } from './components/Home/Home'
import { Toolbar } from './components/Toolbar/Index'
import Store from './store'
import { AppContainer } from './components/styles'

export default () => (
  <Provider store={Store}>
    <AppContainer>
      <Toolbar />
      <Home />
    </AppContainer>
  </Provider>
)