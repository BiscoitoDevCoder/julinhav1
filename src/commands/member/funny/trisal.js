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
  description: "Exibe o ranking dos 5 que mais mandam mensagem!",
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
        .slice(0, 5);

      let lista = `📊 *TOP 5 ATIVOS - MANICÔMIO*\n`;
      lista += `_Os pacientes mais falantes do Hóspicio_\n\n`;

      const mentions = [];

      usuarios.forEach((u, index) => {
        // Pega o ID puro. Se for de dispositivo (ex: :1), remove.
        const userId = u.id.split('@')[0].split(':')[0];
        const jid = `${userId}@s.whatsapp.net`;
        
        mentions.push(jid);
        // O segredo aqui é não ter nada grudado no @${userId}
        lista += `${index + 1}. @${userId} — *${u.mensagens}* msgs\n`;
      });

      lista += `\n_Contagem baseada no histórico do bot._`;

      await socket.sendMessage(remoteJid, { 
        text: lista, 
        mentions: mentions 
      }, { quoted: m });

    } catch (e) {
      console.log("Erro no ranking:", e.message);
    }
  },
};