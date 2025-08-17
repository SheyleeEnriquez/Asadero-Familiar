import React from 'react';
import '../Styles/Login.css';
import logo from '../Assets/logo.png';
import { auth } from '../config/firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom';
function Login() {
  const handleSubmit = async (e) => {
  e.preventDefault();

  const email = e.target.user.value;
  const password = e.target.password.value;
    console.log('Email:', email);
  signInWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    //Get the signed-in user
    const user = userCredential.user;

    // Check if the user is valid
    if (!user) {
      throw new Error('Usuario no válido después del login');
    }

    //Check if the user is verified
    if (!user.emailVerified) {
      throw new Error('Por favor, verifica tu correo electrónico antes de iniciar sesión.');
    }

    // Get the ID token with claims
    const idTokenResult = await user.getIdTokenResult();
    const userRole = idTokenResult.claims?.role;

    // Check if the user role is defined
    if (!userRole) {
      throw new Error('El rol del usuario no está definido. Por favor, contacta al administrador.');
    }

    const idToken = await user.getIdToken();
    localStorage.setItem('userToken', idToken);
    
    switch (userRole) {
      case 'Administrador':
        localStorage.setItem('adminToken', idToken);
        
        window.location.href = '/admin';  
        break;
      case 'Supervisor':
        window.location.href = '/supervisor';  
        break;
      case 'Empleado':
        localStorage.setItem('employeeEmail',email)
        window.location.href = '/employee'; 
        break;
      default:
        alert(`Rol "${userRole}"no reconocido. Por favor, contacta al administrador.`);
        break;
    }
  })
  .catch((error) => {
    console.error('Error durante el proceso de Log In:', error);
    alert(`Error: ${error.message}`);
  });
};

  return (
    <div className="login-page animate-bg">
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

          {/* Texto añadido debajo del botón */}
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <Link 
              to="/olvido-contraseña" 
              style={{
                color: '#8b7355',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
            ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
