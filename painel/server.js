import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
// SERVE OS ARQUIVOS ESTÁTICOS (HTML, CSS, JS do navegador)
app.use(express.static(__dirname)); 

const BOT_PROCESS_NAME = 'takeshi-bot'; 

// ROTA PRINCIPAL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para ligar/desligar
app.post('/api/toggle', (req, res) => {
    const { action } = req.body;
    exec(`pm2 ${action} ${BOT_PROCESS_NAME}`, (error) => {
        if (error) return res.status(500).json({ success: false, message: error.message });
        res.json({ success: true });
    });
});

// Rota para reiniciar
app.post('/api/restart', (req, res) => {
    exec(`pm2 restart ${BOT_PROCESS_NAME}`, () => {
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`🚀 Painel rodando em http://187.45.254.205:${port}`);
});