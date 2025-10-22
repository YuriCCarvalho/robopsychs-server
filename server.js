const express = require('express');
const cors = require('cors'); // <-- 1. IMPORTE O PACOTE CORS
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");

// --- CORREÇÃO IMPORTANTE AQUI ---
// Define a origem permitida para o seu site no GitHub Pages
const allowedOrigin = "https://yuriccarvalho.github.io";

// Opções do CORS para permitir apenas a sua interface
const corsOptions = {
  origin: allowedOrigin
};

// --- 2. APLIQUE O MIDDLEWARE DO CORS AO EXPRESS ---
// Isso vai permitir as requisições POST da sua interface para a rota /command
app.use(cors(corsOptions));

// Esta configuração (que você já tinha) permite que o seu site no GitHub Pages se ligue via Socket.IO
const io = new Server(http, {
  cors: {
    origin: allowedOrigin,
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

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => {
  console.log(`Servidor a ouvir na porta ${PORT}`);
});
