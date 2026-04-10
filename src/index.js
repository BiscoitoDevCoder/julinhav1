/*
 * Se você clicou aqui é porque provavelmente já usou um bot de "case" e com um "index.js" de 20 mil linhas...
 * Eu sei, eu entendo você!
 */

import fs from "fs"; 
import { connect } from "./connection.js";
import { load } from "./loader.js";
import { badMacHandler } from "./utils/badMacHandler.js";
import { bannerLog, errorLog, infoLog, warningLog } from "./utils/logger.js";

process.on("uncaughtException", (error) => {
  if (badMacHandler.handleError(error, "uncaughtException")) return;
  errorLog(`Erro crítico não capturado: ${error.message}`);
  errorLog(error.stack);
  if (!error.message.includes("ENOTFOUND") && !error.message.includes("timeout")) {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason) => {
  if (badMacHandler.handleError(reason, "unhandledRejection")) return;
  errorLog(`Promessa rejeitada não tratada:`, reason);
});

async function startBot() {
  try {
    process.setMaxListeners(1500);
    bannerLog();
    infoLog("Iniciando meus componentes internos...");

    const socket = await connect();

    // --- LÓGICA DE CONTAGEM DE MENSAGENS E NAMORO ---
    socket.ev.on("messages.upsert", async (m) => {
      try {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const gid = msg.key.remoteJid;
        const isGroup = gid.endsWith('@g.us');
        const uid = msg.key.participant || gid;

        // --- 1. LÓGICA DE RESPOSTA DO NAMORO (COM DATABASE) ---
        if (global.pedidosNamoro && isGroup) {
            const text = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || "").toLowerCase().trim();
            const pedido = global.pedidosNamoro[uid];

            if (pedido && pedido.grupo === gid) {
                const deNum = pedido.de.split('@')[0];
                const paraNum = pedido.para.split('@')[0];

                if (text === 's') {
                    // --- SALVANDO NA DATABASE DE CASAIS ---
                    const casaisPath = "./database/casais.json";
                    if (!fs.existsSync("./database")) fs.mkdirSync("./database");
                    if (!fs.existsSync(casaisPath)) fs.writeFileSync(casaisPath, JSON.stringify({}));

                    const casaisDb = JSON.parse(fs.readFileSync(casaisPath, "utf-8"));
                    
                    // Salva usando o LID de quem aceitou como chave para evitar duplicatas
                    casaisDb[uid] = {
                        de: pedido.de,
                        para: pedido.para,
                        data: new Date().toLocaleDateString('pt-BR')
                    };

                    fs.writeFileSync(casaisPath, JSON.stringify(casaisDb, null, 2));
                    // ---------------------------------------

                    await socket.sendMessage(gid, { 
                        text: `💍 *FOI DITO O SIM!* 💍\n\nAgora o casal mais lindo do Manicômio é @${deNum} e @${paraNum}! ❤️✨\n\nO relacionamento foi registrado no banco de dados oficial!`,
                        mentions: [pedido.de, pedido.para]
                    });
                    delete global.pedidosNamoro[uid]; 
                } 
                else if (text === 'n') {
                    await socket.sendMessage(gid, { 
                        text: `💔 *SOLDADO ABATIDO...*\n\nInfelizmente não sobrou nada para o betinha @${deNum}... @${paraNum} te deixou na pista! 💨`,
                        mentions: [pedido.de, pedido.para]
                    });
                    delete global.pedidosNamoro[uid];
                }
            }
        }

        // --- 2. LÓGICA DE CONTAGEM (RANK ATIVOS) ---
        if (isGroup && !msg.message.stickerMessage) {
            const dbPath = "./database/historico.json";
            const name = msg.pushName || "Membro";

            if (!fs.existsSync("./database")) fs.mkdirSync("./database");
            if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));

            const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
            if (!db[gid]) db[gid] = {};
            if (!db[gid][uid]) db[gid][uid] = { nome: name, mensagens: 0 };
            
            db[gid][uid].mensagens += 1;
            db[gid][uid].nome = name; 
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        }
      } catch (err) {
          // Erro silencioso
      }
    });

    load(socket);

    setInterval(() => {
      const currentStats = badMacHandler.getStats();
      if (currentStats.errorCount > 0) {
        warningLog(`BadMacHandler stats: ${currentStats.errorCount}/${currentStats.maxRetries} erros`);
      }
    }, 300_000);

  } catch (error) {
    if (badMacHandler.handleError(error, "bot-startup")) {
      warningLog("Erro Bad MAC durante inicialização, tentando novamente...");
      setTimeout(() => startBot(), 5000);
      return;
    }
    errorLog(`Erro ao iniciar o bot: ${error.message}`);
    process.exit(1);
  }
}

startBot();