const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    'index',
    createProxyMiddleware({
      target: 'http://localhost:5000', // Change this to your backend server URL
      changeOrigin: true,
    })
  );
};
