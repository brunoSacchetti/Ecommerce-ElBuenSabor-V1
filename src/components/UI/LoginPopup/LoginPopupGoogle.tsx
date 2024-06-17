import React, { useEffect, useState } from 'react';
import "./LoginPopup.css";
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/slices/userSlice';
import { assets } from '../../../assets/assets';

import { gapi } from 'gapi-script';
import GoogleLogin from 'react-google-login';

const clienteId = import.meta.env.CLIENTE_ID_GOOGLE;

type LoginProps = {
  setShowLogin: (value: any) => void;
};

export const LoginPopupGoogle: React.FC<LoginProps> = ({ setShowLogin }) => {
  
  const clientId = "122787617287-ke3rv25jsd7jd723ihvnheavu4feln2g.apps.googleusercontent.com";

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    fechaNacimiento: '',
    domicilios: [{ calle: '9 de Juli', numero: 53, cp:5500 , piso: 1, nroDpto: 1, idLocalidad: 1 }], // Ejemplo de domicilio, ajusta según tus necesidades
    imagenUrl: '',
    userName: '',
    password: ''
  });

  const [currState, setCurrState] = useState("Sign Up");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let url = '';
      let method = 'POST';

      if (currState === 'Sign Up') {
        url = 'http://localhost:8080/clientes/register-cliente';
      } else {
        url = 'http://localhost:8080/clientes/login';
        method = 'POST'; // Puedes ajustar según la implementación en el backend
      }


      //#region REVISAR
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al ' + (currState === 'Sign Up' ? 'registrar' : 'iniciar sesión') + ' el cliente');
      }

      const responseData = await response.json();

      console.log("Usuario Registrado:", responseData);

      // Si el login fue exitoso, actualiza el estado de Redux con los datos del usuario
      dispatch(login(responseData));

      // Cerrar el popup después de registrar o iniciar sesión
      setShowLogin(false);
    } catch (error : any) {
      console.error('Error:', error);
      setErrorMessage("Usuario y/o Contraseña incorrecta");
      // Manejar el error en el registro o login
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    //const userObject = decodeJwtResponse(response.credential);
    const userObject = response.profileObj

    console.log(userObject);
    

    const googleFormData = {
      nombre: userObject.givenName,
      apellido: userObject.familyName,
      telefono: '', //
      email: userObject.email,
      fechaNacimiento: '', //
      domicilios: [{ calle: '9 de Juli', numero: 53, cp:5500 , piso: 1, nroDpto: 1, idLocalidad: 1 }],
      imagenUrl: userObject.imageUrl,
      userName: userObject.email,
      password: userObject.password //
    };

    
    try {
      const url = 'http://localhost:8080/clientes/register-cliente'; // Ajusta la URL para manejar login con Google
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(googleFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión con Google');
      }

      const responseData = await response.json();
      dispatch(login(responseData));
      setShowLogin(false);
    } catch (error: any) {
      console.error('Error:', error);
      setErrorMessage("Error al iniciar sesión con Google");
    }
  };

  /* function decodeJwtResponse(token:any) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  } */

  const decodeJwtResponse = (token: any) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
  };

  const handleGoogleFailure = () => {
    console.error('Google Sign-In Error:');
    setErrorMessage("Error al iniciar sesión con Google");
  };

  useEffect(() => {
    const start = () => {
      gapi.auth2.init({
        clientId: clientId,
      })
    }
    gapi.load("client:auth2", start);

  }, []);

  return (
    <div className='login-popup'>

      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Cerrar" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? null :
            <>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder='Nombre' required />
              <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder='Apellido' required />
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder='Telefono' required />
              <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder='Email' required />
              <input type="text" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} placeholder='URL imagen' />
            </>
          }
          <input type="text" name="userName" value={formData.userName} onChange={handleChange} placeholder='User Name' required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder='****' required />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">{currState === "Sign Up" ? "Create Account" : "Login"}</button>
        {currState === "Login" ? null :
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>Accept terms and conditions.</p>
          </div>
        }
        {currState === "Login" ?
          <p>Crear una nueva cuenta? <span onClick={() => setCurrState("Sign Up")}>Click Here</span></p> :
          <p>Ya tienes cuenta? <span onClick={() => setCurrState("Login")}>Login Here</span></p>
        }
        <GoogleLogin
        clientId={clientId}
        onSuccess={handleGoogleSuccess}
        onFailure={handleGoogleFailure}
        cookiePolicy={"single_host_policy"}
      />
      </form>
    </div>
  );
};
