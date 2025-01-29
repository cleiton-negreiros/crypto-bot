import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoedasEmAlta = () => {
  const [coins, setCoins] = useState([]); // Lista de moedas em alta
  const [selectedCoin, setSelectedCoin] = useState(null); // Moeda selecionada
  const [historico, setHistorico] = useState(null); // Dados históricos da moeda selecionada
  const [error, setError] = useState(null); // Estado para armazenar erros

  // Busca as moedas em alta
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );

        // Filtra as moedas que estão em alta (variação positiva nas últimas 24h)
        const coinsInRise = response.data.filter(coin => coin.price_change_percentage_24h > 0);

        // Ordena as moedas pela maior valorização
        coinsInRise.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);

        setCoins(coinsInRise);
        setError(null); // Limpa o erro se a requisição for bem-sucedida
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar os dados. Tente novamente mais tarde.'); // Exibe uma mensagem de erro
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Atualiza a cada 60 segundos (1 minuto)

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  // Busca o histórico de preços da moeda selecionada
  const fetchHistorico = async (coinId) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=brl&days=7&interval=daily`
      );

      // Formata os dados para o gráfico
      const historicoData = response.data.prices.map((price) => ({
        data: new Date(price[0]).toLocaleDateString(), // Formata a data
        valor: price[1], // Valor do preço
      }));

      setHistorico({
        labels: historicoData.map((item) => item.data), // Datas
        valores: historicoData.map((item) => item.valor), // Valores
      });
      setError(null); // Limpa o erro se a requisição for bem-sucedida
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      if (error.response && error.response.status === 429) {
        setError('Limite de requisições excedido. Tente novamente mais tarde.'); // Mensagem específica para erro 429
      } else {
        setError('Erro ao carregar o histórico de preços. Verifique sua conexão com a internet.'); // Mensagem genérica
      }
    }
  };

  // Ao clicar em uma moeda
  const handleCoinClick = (coinId) => {
    setSelectedCoin(coinId); // Define a moeda selecionada
    fetchHistorico(coinId); // Busca o histórico de preços
  };

  // Dados para o gráfico
  const chartData = {
    labels: historico ? historico.labels : [],
    datasets: [
      {
        label: 'Preço (BRL)',
        data: historico ? historico.valores : [],
        borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha do gráfico
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo do gráfico
        borderWidth: 2,
      },
    ],
  };

  // Opções do gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Histórico de Preços (Últimos 7 Dias)',
      },
    },
  };

  return (
    <div>
      <h1>Moedas em Alta (24h)</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe a mensagem de erro */}
      <ul>
        {coins.map(coin => (
          <li
            key={coin.id}
            onClick={() => handleCoinClick(coin.id)}
            style={{ cursor: 'pointer', margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          >
            <img src={coin.image} alt={coin.name} width="20" />
            <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
            <span style={{ color: 'green' }}>
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
            <span>Preço: {coin.current_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </li>
        ))}
      </ul>

      {/* Exibe o gráfico se houver dados históricos */}
      {historico && selectedCoin && (
        <div style={{ marginTop: '20px' }}>
          <h2>Histórico de Preços</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default MoedasEmAlta;