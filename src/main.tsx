import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store/store.ts'
import { login } from './redux/slices/userSlice.ts';
import "./index.css"
const user = localStorage.getItem('user');
if (user) {
  store.dispatch(login(JSON.parse(user))); // Restaura el estado de autenticación
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
