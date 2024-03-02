const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://localhost:4000', // Change this to your backend server URL
      changeOrigin: true,
    })
  );
};
