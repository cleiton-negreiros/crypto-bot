const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Prefixo para as requisições
    createProxyMiddleware({
      target: 'https://api.coingecko.com', // URL da API
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove o prefixo /api da URL
      },
    })
  );
};