import React from 'react';
import '../Styles/Login.css';
import logo from '../Assets/logo.png';
function Login() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.user.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('BBody',response.body);
      console.log('Response:', response);

      if (response.ok) {
        // Redirigir a otra página si el login fue exitoso
        window.location.href = '/admin'; // o la ruta que corresponda
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

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

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="user">Usuario</label>
          <input id="user" name="user" type="text" placeholder="JuanGonzalez" required />
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" placeholder="*****" required />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
