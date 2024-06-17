import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store/store.ts'
import { login } from './redux/slices/userSlice.ts';
import "./index.css"
import { GoogleOAuthProvider } from '@react-oauth/google';

const user = localStorage.getItem('user');
if (user) {
  store.dispatch(login(JSON.parse(user))); // Restaura el estado de autenticación
}

//const clientId = import.meta.env.CLIENTE_ID_GOOGLE;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId='122787617287-ke3rv25jsd7jd723ihvnheavu4feln2g.apps.googleusercontent.com'>
    <BrowserRouter>
    <Provider store={store}>
    
      <App />

    </Provider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
