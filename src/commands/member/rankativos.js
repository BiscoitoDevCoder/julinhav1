import { PREFIX } from "../../config.js";
import fs from "fs";
import path from "path";

// Ajustando para a pasta database
const databasePath = path.resolve("database", "historico.json");

const getDb = () => {
  if (!fs.existsSync(databasePath)) return {};
  return JSON.parse(fs.readFileSync(databasePath, "utf-8"));
};

const saveDb = (db) => {
  fs.writeFileSync(databasePath, JSON.stringify(db, null, 2));
};

export default {
  name: "rankativos",
  description: "Exibe o ranking de quem mais manda mensagem!",
  commands: ["rankativos", "ativos", "ranking"],
  usage: `${PREFIX}rankativos`,
  handle: async ({ socket, remoteJid, fullMessage, isGroup, sendReply }) => {
    try {
      if (!isGroup) return;

      const db = getDb();
      const groupId = remoteJid;

      if (!db[groupId]) {
        return await socket.sendMessage(remoteJid, { text: " telemetry_error: Ainda não há dados de mensagens neste grupo." }, { quoted: fullMessage });
      }

      // Transforma o objeto em array e organiza do maior para o menor
      const usuarios = Object.entries(db[groupId])
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.mensagens - a.mensagens)
        .slice(0, 10);

      let lista = `🏆 *RANKING DE ATIVOS - MANICÔMIO* 🏆\n\n`;
      const medalhas = ["🥇", "🥈", "🥉", "4º", "5º", "6º", "7º", "8º", "9º", "10º"];

      usuarios.forEach((u, index) => {
        lista += `${medalhas[index]} *${u.nome}*: ${u.mensagens} msgs\n`;
      });

      await socket.sendMessage(remoteJid, { 
        text: lista,
        mentions: usuarios.map(u => u.id) 
      }, { quoted: fullMessage });

    } catch (e) {
      console.log("Erro no ranking:", e);
    }
  },
};