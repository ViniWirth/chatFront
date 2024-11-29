import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import imagem from '../assets/AAA.png'; // Ajuste o caminho da imagem conforme necessário
import '../chat.css';

function Chat() {
  const { salaId } = useParams(); // Recupera o id da sala da URL
  const [salas, setSalas] = useState<any[]>([]);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [novaMensagem, setNovaMensagem] = useState(""); // Estado para a nova mensagem

  const nickUsuario = localStorage.getItem('nick') || "Usuário";
  const token = localStorage.getItem('token') || "";

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/salas');
        setSalas(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
        setLoading(false);
      }
    };
    fetchSalas();
  }, []);

  useEffect(() => {
    if (salaId && salas.length > 0) {
      const sala = salas.find((s) => s._id === salaId);
      if (sala) setMensagens(sala.msgs);
    }
  }, [salaId, salas]);

  useEffect(() => {
    if (!salaId) return;

    const fetchMensagens = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sala/${salaId}/mensagens`, {
          headers: {
            'token': token,
          },
        });
        if (JSON.stringify(mensagens) !== JSON.stringify(response.data)) {
          setMensagens(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      }
    };

    const interval = setInterval(fetchMensagens, 2000);
    fetchMensagens();
    return () => clearInterval(interval);
  }, [salaId, token, mensagens]);

  const formatarData = (timestamp: number) => {
    const data = new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(data);
  };

  const enviarMensagem = async () => {
    if (novaMensagem.trim()) {
      const novaMsg = { msg: novaMensagem, idSala: salaId };

      try {
        const response = await axios.post(
          'http://localhost:5000/sala/mensagem',
          novaMsg,
          {
            headers: {
              'token': token,
              'nick': nickUsuario,
            },
          }
        );

        if (response.status === 200) {
          setMensagens([...mensagens, { ...novaMsg, timestamp: Date.now(), nick: nickUsuario }]);
          setNovaMensagem("");
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  };

  const contarUsuariosUnicos = () => {
    const usuarios = new Set(mensagens.map((msg) => msg.nick));
    return usuarios.size;
  };

  if (loading) {
    return <div>Carregando salas...</div>;
  }

  const sala = salas.find((s) => s._id === salaId);
  const nomeSala = sala ? sala.nome : 'Sala desconhecida';

  return (
    <div
      className="chat-container"
      style={{ backgroundColor: 'white', borderRadius: 20 }}	
    >
      <div className="chat-header">
        <div className="room-name">{nomeSala}</div>
        <div className="active-users">
          <div>{contarUsuariosUnicos()}</div>
        </div>
      </div>

      <div className="chat-messages">
        {mensagens.length === 0 ? (
          <div className="text-center">Nenhuma mensagem ainda.</div>
        ) : (
          mensagens.map((mensagem, index) => (
            <div
              key={index}
              className={`chat-message ${
                mensagem.nick === nickUsuario ? "user" : "other"
              }`}
            >
              <p className="sender">{mensagem.nick}</p>
              <p style={{color: "black"}}>{mensagem.msg}</p>
              <p className="timestamp">{formatarData(mensagem.timestamp)}</p>
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          placeholder="Mensagem..."
        />
        <button onClick={enviarMensagem}>Enviar</button>
      </div>
    </div>
  );
}

export default Chat;
