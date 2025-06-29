// Importe os pacotes necessários
const jsonServer = require('json-server');
const path = require('path');

// Crie uma instância do servidor Express (que o json-server usa por baixo dos panos)
const server = jsonServer.create();

// Crie um roteador apontando para o seu arquivo db.json
// O path.join garante que o caminho para o db.json seja resolvido corretamente
// a partir da pasta 'api' para a raiz do projeto.
const router = jsonServer.router(path.join(__dirname, '..', 'db.json'));

// Use os middlewares padrão do json-server (para logging, cors, etc.)
const middlewares = json-server.defaults();

// Configure o servidor para usar os middlewares e o roteador
server.use(middlewares);
server.use(router);

// Exporte a instância do servidor.
// A Vercel usará isso para criar a serverless function.
module.exports = server;