import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imagem from '../assets/channels4_profile.jpg'; // Imagem de fundo
import '../login.css';

function Home() {
  const [salas, setSalas] = useState<any[]>([]); // Para armazenar as salas
  const [loading, setLoading] = useState(true); // Para exibir um indicador de carregamento
  const navigate = useNavigate();

  // Função para buscar as salas da API
  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/salas");
        console.log(response.data); // Verifique a estrutura dos dados retornados
        setSalas(response.data);
        setLoading(false); // Atualiza o estado de loading quando as salas forem carregadas
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
        setLoading(false); // Ainda desabilita o loading mesmo que ocorra um erro
      }
    };

    fetchSalas();
  }, []);

  // Função para navegar para a sala específica
  const entrarNaSala = (salaId: string) => {
    navigate(`/chat/${salaId}`);
  };

  // Exibindo um loading enquanto as salas estão sendo carregadas
  if (loading) {
    return (
      <div className="login-container">
        <p>Carregando salas...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ backgroundColor: "white", borderRadius: 20, justifyContent: "center", alignItems: "center", justifyItems: "center", textAlign: "center" }}>
      <div className="header">
        <h2 style={{ fontWeight: "bold" }}>Salas Disponíveis</h2>
        <div className="new-group">
          <span style={{ fontWeight: "bold" }}>{salas.length}</span>
        </div>
      </div>

      <ul className="chat-list">
        {salas.length === 0 ? (
          <li className="chat-details">Nenhuma sala disponível</li>
        ) : (
          salas.map((sala) => {
            // Verificar se 'msgs' está presente e não é vazio
            const ultimaMsg = sala.msgs && sala.msgs.length > 0 ? sala.msgs[sala.msgs.length - 1] : null;
            const ultimaMsgTexto = ultimaMsg ? ultimaMsg.msg : "Nenhuma mensagem";
            const ultimaMsgNick = ultimaMsg ? ultimaMsg.nick : "Desconhecido";
            const ultimaMsgHora = ultimaMsg ? (ultimaMsg.timestamp ? new Date(ultimaMsg.timestamp).toLocaleTimeString() : "Indefinido") : "Indefinido";

            return (
              <li
                key={sala._id}
                onClick={() => entrarNaSala(sala._id)}
              >
                <img src={imagem} alt="Imagem do contato" />
                <div className="chat-details">
                  <h3>{sala.nome}</h3>
                  <p>
                    {ultimaMsgTexto} - {ultimaMsgNick} ({ultimaMsgHora})
                  </p>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default Home;
