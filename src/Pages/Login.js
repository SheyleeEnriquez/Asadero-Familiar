import React from 'react';
import '../Styles/Login.css';
import logo from '../Assets/logo.png';

function Login() {
  return (
    <div className="login-page animate-bg">
      <header className="login-header">
        <img src={logo} alt="Asadero Familiar Logo" className="logo" />
      </header>


      <div className="login-container">
  <div className="login-logo-container">
          <img src={logo} alt="Asadero Familiar Logo" className="login-logo-container" />
          <h2>
        Iniciar sesión<br />
        <span>Asadero Familiar</span>
      </h2>

  </div>

  <form className="login-form">
    <label htmlFor="user">Usuario</label>
    <input id="user" type="text" placeholder="JuanGonzalez" required />
    <label htmlFor="password">Contraseña</label>
    <input id="password" type="password" placeholder="*****" required />
    <button type="submit">Ingresar</button>
  </form>
</div>


    </div>
  );
}

export default Login;
