import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../login.css';
import imagem from '../assets/logoChatinho.png';
import gif from '../assets/videoplayback.gif';

function Login() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [showV, setShowV] = useState(false);

  const pegarNome = async () => {
    if (nome.trim()) {
      setShowV(true);
      try {
        const response = await axios.post("http://localhost:5000/entrar", { nick: nome });
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('iduser', response.data.idUser);
          localStorage.setItem('nick', response.data.nick);
          setTimeout(() => navigate('/home'), 1000);
        } else {
          console.error("Token não recebido da API");
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
      } finally {
        setShowV(false);
      }
    }
  };

  return (
    <div className="login-container">
      <img src={imagem} alt="Logo" />
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Digite seu nome"
      />
      <button onClick={pegarNome}>Entrar</button>
    </div>
  );
}

export default Login;
