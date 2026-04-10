import { PREFIX } from "../../config.js";
import fs from "fs";
import path from "path";

const databasePath = path.resolve("database", "historico.json");

const getDb = () => {
  if (!fs.existsSync(databasePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(databasePath, "utf-8"));
  } catch (e) {
    return {};
  }
};

export default {
  name: "rankativos",
  description: "Exibe o ranking de quem mais manda mensagem!",
  commands: ["rankativos", "ativos", "ranking"],
  usage: `${PREFIX}rankativos`,
  handle: async (props) => {
    const { socket, remoteJid, isGroup } = props;
    const m = props.fullMessage || props.m || props.message;

    try {
      if (!isGroup) return;

      const db = getDb();
      const groupId = remoteJid;

      if (!db[groupId] || Object.keys(db[groupId]).length === 0) {
        return await socket.sendMessage(remoteJid, { text: "⚠️ O Manicômio ainda não registrou mensagens hoje." });
      }

      const usuarios = Object.entries(db[groupId])
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.mensagens - a.mensagens)
        .slice(0, 10);

      let lista = `📊 *RANKING DE ATIVOS - MANICÔMIO*\n`;
      lista += `_Os que mais movimentam o hospício_\n\n`;

      usuarios.forEach((u, index) => {
        // Formata para marcar a pessoa: @número
        const jid = u.id.split("@")[0];
        lista += `${index + 1}. @${jid} — *${u.mensagens}* mensagens\n`;
      });

      lista += `\n_Contagem baseada no histórico do bot._`;

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