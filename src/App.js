import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MoedasEmBaixa from './pages/MoedasEmBaixa';
import MoedasPopulares from './pages/MoedasPopulares';
import MoedasEmAlta from './pages/MoedasEmAlta'; // Importe a nova página
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Moedas em Baixa</Link>
            </li>
            <li>
              <Link to="/populares">Moedas Populares</Link>
            </li>
            <li>
              <Link to="/alta">Moedas em Alta</Link> {/* Novo link */}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<MoedasEmBaixa />} />
          <Route path="/populares" element={<MoedasPopulares />} />
          <Route path="/alta" element={<MoedasEmAlta />} /> {/* Nova rota */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;