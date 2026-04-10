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
  handle: async ({ sendReply, remoteJid, isGroup }) => {
    try {
      if (!isGroup) {
        return await sendReply("O ranking só está disponível para grupos! 📊");
      }

      const db = getDb();
      const groupId = remoteJid;

      if (!db[groupId] || Object.keys(db[groupId]).length === 0) {
        return await sendReply("⚠️ O Manicômio ainda não registrou mensagens hoje.");
      }

      const usuarios = Object.entries(db[groupId])
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.mensagens - a.mensagens)
        .slice(0, 5);

      let response = `📊 *TOP 5 ATIVOS - MANICÔMIO*\n`;
      response += `_Os pacientes mais falantes do Hóspicio_\n\n`;

      const mentions = [];

      usuarios.forEach((u, index) => {
        const number = u.id.split('@')[0];
        const pos = index + 1;
        
        // Seguindo o padrão do comando 'lindos'
        response += `${pos}º - @${number} — *${u.mensagens}* msgs\n`;
        mentions.push(u.id);
      });

      response += `\n_Contagem baseada no histórico do bot._`;

      // Usando o sendReply do seu bot (Texto, Mentions)
      await sendReply(response, mentions);

    } catch (e) {
      console.error("Erro no ranking:", e);
    }
  },
};