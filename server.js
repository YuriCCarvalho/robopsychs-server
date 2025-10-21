const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");

// --- CORREÇÃO IMPORTANTE AQUI ---
// Esta configuração permite que o seu site no GitHub Pages se ligue
const io = new Server(http, {
  cors: {
    origin: "https://yuriccarvalho.github.io", // O seu URL do GitHub Pages
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

// Rota para verificar se o servidor está online
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
