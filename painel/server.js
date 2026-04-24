import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000; // Porta onde o painel vai abrir

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname)); // Serve seu HTML e CSS

// NOME DO PROCESSO NO PM2 (Mude para o nome que aparece no 'pm2 list')
const BOT_PROCESS_NAME = 'takeshi-bot'; 

// Rota para ligar/desligar (PM2 Start/Stop)
app.post('/api/toggle', (req, res) => {
    const { action } = req.body; // 'start' ou 'stop'
    
    exec(`pm2 ${action} ${BOT_PROCESS_NAME}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro: ${error}`);
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, message: `Bot ${action === 'start' ? 'Ligado' : 'Desligado'}!` });
    });
});

// Rota para reiniciar (PM2 Restart)
app.post('/api/restart', (req, res) => {
    exec(`pm2 restart ${BOT_PROCESS_NAME}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ success: true, message: 'Reiniciando...' });
        }
        res.json({ success: true, message: 'Bot Reiniciado com sucesso!' });
    });
});

app.listen(port, () => {
    console.log(`🚀 Painel da Julinha rodando em http://localhost:${port}`);
});
