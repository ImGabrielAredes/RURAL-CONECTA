// api/index.js - VERSÃO RECOMENDADA (Lendo o arquivo)

const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '..', 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
// A LINHA CORRIGIDA ESTÁ AQUI:
server.use('/api', router);

module.exports = server;