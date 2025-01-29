const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/ws', // Rota do WebSocket
    createProxyMiddleware({
      target: 'ws://localhost:8080', // URL do servidor WebSocket
      ws: true, // Habilita suporte a WebSocket
      changeOrigin: true,
    })
  );
};