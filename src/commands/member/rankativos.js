import { PREFIX } from "../../config.js";
import fs from "fs";
import path from "path";

// Caminho para a pasta database
const databasePath = path.resolve("database", "historico.json");

const getDb = () => {
  if (!fs.existsSync(databasePath)) return {};
  return JSON.parse(fs.readFileSync(databasePath, "utf-8"));
};

export default {
  name: "rankativos",
  description: "Exibe o ranking de quem mais manda mensagem!",
  commands: ["rankativos", "ativos", "ranking"],
  usage: `${PREFIX}rankativos`,
  handle: async (props) => {
    // Pegando as propriedades de forma segura
    const { socket, remoteJid, isGroup } = props;
    
    // Tenta pegar a mensagem original de várias formas para evitar o erro de 'fromMe'
    const m = props.fullMessage || props.m || props.message;

    try {
      if (!isGroup) return;

      const db = getDb();
      const groupId = remoteJid;

      if (!db[groupId] || Object.keys(db[groupId]).length === 0) {
        return await socket.sendMessage(remoteJid, { text: "⚠️ Ainda não há dados de mensagens neste grupo." });
      }

      const usuarios = Object.entries(db[groupId])
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.mensagens - a.mensagens)
        .slice(0, 10);

      let lista = `🏆 *RANKING DE ATIVOS - MANICÔMIO* 🏆\n\n`;
      const medalhas = ["🥇", "🥈", "🥉", "4º", "5º", "6º", "7º", "8º", "9º", "10º"];

      usuarios.forEach((u, index) => {
        lista += `${medalhas[index]} *${u.nome}*: ${u.mensagens} msgs\n`;
      });

      // Só adiciona o quoted se o 'm' for válido e tiver a propriedade 'key'
      const sendOptions = { 
        mentions: usuarios.map(u => u.id) 
      };
      
      if (m && m.key) {
        sendOptions.quoted = m;
      }

      await socket.sendMessage(remoteJid, { text: lista }, sendOptions);

    } catch (e) {
      console.log("Erro no ranking:", e.message);
    }
  },
};