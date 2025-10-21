const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");

// Permite que o nosso site no GitHub Pages se ligue a este servidor
const io = new Server(http, {
  cors: {
    origin: "https://YuriCCarvalho.github.io", // IMPORTANTE: O seu URL do GitHub Pages
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

// Uma rota simples para verificar se o servidor está online
app.get('/', (req, res) => {
  res.send('Servidor Robopsychs está a funcionar!');
});

// Rota que recebe o comando do controlador
app.post('/command', (req, res) => {
  const { expression } = req.body;
  if (expression) {
    console.log(`Comando recebido do controlador: ${expression}`);
    // Retransmite o comando para todos os rostos conectados
    io.emit('expression-change', expression); 
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor a ouvir na porta ${PORT}`);
});