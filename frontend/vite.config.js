export default {
  server: {
    port: 4000,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  clearScreen: false
};
