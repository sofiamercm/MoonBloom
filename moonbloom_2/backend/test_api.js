const jwt = require('jsonwebtoken');
const http = require('http');

const secret = 'cambia_esto_por_un_string_aleatorio_largo_de_minimo_32_caracteres';
const userId = '6a039c2b6e4253b9c5d70e31';
const token = jwt.sign({ id: userId }, secret);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/cycles',
  method: 'GET',
  headers: {
    'Cookie': `token=${token}`
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', console.error);
req.end();
