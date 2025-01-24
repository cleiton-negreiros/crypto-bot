import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CryptoBot = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );

        const coinsInDrop = response.data.filter(coin => coin.price_change_percentage_24h < 0);
        coinsInDrop.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);

        setCoins(coinsInDrop);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000); // Atualiza a cada 15 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Moedas em Baixa (24h)</h1>
      <ul>
        {coins.map(coin => (
          <li key={coin.id}>
            <img src={coin.image} alt={coin.name} width="20" />
            <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
            <span style={{ color: 'red' }}>
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
            <span>Preço: {coin.current_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CryptoBot;