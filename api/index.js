// api/index.js - VERSÃO FINAL E À PROVA DE BALA

const jsonServer = require('json-server');

// 1. Crie o servidor
const server = jsonServer.create();

// 2. Crie o objeto de dados DIRETAMENTE AQUI DENTRO
// Este é o nosso novo "db.json" que vive dentro do código.
const data = {
  empregos: [
    {
      "id": "1",
      "tituloVaga": "Tratorista (TESTE)",
      "local": "API Funcionando!"
    },
    {
      "id": "2",
      "tituloVaga": "Técnico Agrícola (TESTE)",
      "local": "Dados Carregados com Sucesso!"
    },
    {
      "id": "3",
      "tituloVaga": "Auxiliar Rural (TESTE)",
      "local": "Finalmente!"
    }
  ],
  // Você pode adicionar suas outras chaves aqui se precisar delas em outras páginas
  produtos: [],
  cursos: [],
  candidaturas: [],
  inscricoes: []
};

// 3. Crie o roteador usando o OBJETO "data", e não mais o caminho de um arquivo.
const router = jsonServer.router(data);

// 4. Configure os middlewares (regras padrão)
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(router);

// 5. Exporte o servidor para a Vercel
module.exports = server;