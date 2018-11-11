const axios = require('axios');
const adapter = require('axios/lib/adapters/http');

CLASH_ROYALE_API_BASE_URL = 'https://api.royaleapi.com';
CLASH_ROYALE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk4MiwiaWRlbiI6IjMyNjMzNjExMDUxMjk2MzU5NCIsIm1kIjp7fSwidHMiOjE1NDE4OTg2MDc5NDZ9.gUteOShoLXCQ4fwZsPVxEzZo6XTIS8Xdgi5sLCIo4TU';


axios.defaults.baseURL = CLASH_ROYALE_API_BASE_URL;
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.get['Authorization'] = `Bearer ${CLASH_ROYALE_API_KEY}`;
axios.defaults.adapter = adapter;

const getBattles = async tag => {
  return (await axios.get(`/player/${tag}/battles`)).data;
};

module.exports = {
  getBattles,
};
