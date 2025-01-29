// src/WebSocketClient.js
import React, { useState, useEffect } from 'react';

const WebSocketClient = () => {
  const [messages, setMessages] = useState([]); // Armazena as mensagens recebidas
  const [inputValue, setInputValue] = useState(''); // Armazena o valor do input

  // Conecta ao WebSocket quando o componente é montado
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    // Evento quando a conexão é aberta
    socket.onopen = () => {
      console.log('Conexão WebSocket estabelecida');
    };

    // Evento quando uma mensagem é recebida
    socket.onmessage = (event) => {
      console.log('Mensagem recebida do servidor:', event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]); // Adiciona a mensagem à lista
    };

    // Evento quando a conexão é fechada
    socket.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };

    // Evento em caso de erro
    socket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };

    // Limpa a conexão ao desmontar o componente
    return () => {
      socket.close();
    };
  }, []);

  // Função para enviar uma mensagem ao servidor
  const sendMessage = () => {
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () => {
      socket.send(inputValue); // Envia a mensagem
      setInputValue(''); // Limpa o input
    };
  };

  return (
    <div>
      <h1>WebSocket Client</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite uma mensagem"
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
      <div>
        <h2>Mensagens Recebidas:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketClient;