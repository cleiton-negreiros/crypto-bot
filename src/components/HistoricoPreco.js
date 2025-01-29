import React from 'react';
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

const HistoricoPreco = ({ dados }) => {
  // Formata os dados para o gráfico
  const data = {
    labels: dados.labels, // Datas
    datasets: [
      {
        label: 'Preço (BRL)',
        data: dados.valores, // Valores
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
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

  return <Line data={data} options={options} />;
};

export default HistoricoPreco;