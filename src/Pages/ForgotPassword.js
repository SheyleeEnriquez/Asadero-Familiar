// src/Pages/ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/logo.png';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('El correo electrónico es requerido');
      return;
    }

    if (!validateEmail(email)) {
      setError('Formato de correo electrónico no válido');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3050/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim()
        })
      });

      if (response.status === 200) {
        toast.success("¡Se ha enviado un enlace de recuperación a tu correo electrónico!");
        
        // Volver al login después de 2 segundos
        setTimeout(() => {
          navigate('/');
        }, 6000);
      } else if (response.status === 404) {
        setError('No existe una cuenta con este correo electrónico');
      } else if (response.status === 400) {
        setError('Correo electrónico no válido');
      } else {
        setError('Error al enviar la solicitud. Inténtalo de nuevo');
      }
    } catch (error) {
      console.error('Error al enviar solicitud de reset:', error);
      setError('Error de conexión. Verifica tu conexión a internet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page animate-bg">
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo-container">
          <img src={logo} alt="Asadero Familiar Logo" className="login-logo-container" />
          <h2>
            Iniciar sesión<br />
            <span>Asadero Familiar</span>
          </h2>
        </div>

        {/* Título */}
        <h2 style={{
          color: '#5d4e37',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '8px',
          margin: '0'
        }}>
          Recuperar contraseña
        </h2>
        
        <p style={{
          color: '#8b7355',
          fontSize: '16px',
          marginBottom: '30px',
          lineHeight: '1.4'
        }}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              color: '#5d4e37',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: error ? '2px solid #e74c3c' : '1px solid #d4c4a0',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = '#ff6b35';
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = '#d4c4a0';
              }}
            />
            {error && (
              <div style={{
                color: '#e74c3c',
                fontSize: '12px',
                marginTop: '5px',
                fontWeight: '500'
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Botón Enviar */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#8b7355' : '#6b5b42',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = '#5a4936';
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = '#6b5b42';
            }}
          >
            {loading && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>

          {/* Enlace volver al login */}
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <Link 
                to="/"
                style={{
                color: '#8b7355',
                fontSize: '14px',
                textDecoration: 'underline'
                }}
            >
            ← Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>

      {/* Estilos para la animación del spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ForgotPassword;