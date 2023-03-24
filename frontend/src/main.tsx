import React from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css"
import App from './App'
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { store } from './features/store'
import { Toaster } from 'react-hot-toast'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>
    {/* </React.StrictMode>, */}
  </Provider>
)
