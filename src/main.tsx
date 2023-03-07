import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { I18nextProvider } from 'react-i18next'

import App from './App'
import AppSlice from './store/index'
import i18n from './language/i18n'
import './index.css'

const store = configureStore({
  reducer: {
    main: AppSlice,
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
)
