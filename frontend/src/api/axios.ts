import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jubilant-computing-machine-5jj9p7wv64qfx99-8000.app.github.dev/api/',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
