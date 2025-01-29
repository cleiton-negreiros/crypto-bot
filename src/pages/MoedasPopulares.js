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

const MoedasPopulares = () => {
  const [coins, setCoins] = useState([]); // Lista de moedas populares
  const [selectedCoin, setSelectedCoin] = useState(null); // Moeda selecionada
  const [historico, setHistorico] = useState(null); // Dados históricos da moeda selecionada
  const [error, setError] = useState(null); // Estado para armazenar erros

  // Busca as moedas populares
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=volume_desc&per_page=10&page=1&sparkline=false'
        );

        setCoins(response.data);
        setError(null); // Limpa o erro se a requisição for bem-sucedida
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar os dados. Verifique sua conexão com a internet.'); // Exibe uma mensagem de erro
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 70000); // Atualiza a cada 15 segundos

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
      setError('Erro ao carregar o histórico de preços. Verifique sua conexão com a internet.'); // Exibe uma mensagem de erro
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
        borderColor: 'rgba(54, 162, 235, 1)', // Cor da linha do gráfico
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Cor de fundo do gráfico
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
      <h1>Moedas Populares (Volume 24h)</h1>
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
            <span>Volume: {coin.total_volume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
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

export default MoedasPopulares;