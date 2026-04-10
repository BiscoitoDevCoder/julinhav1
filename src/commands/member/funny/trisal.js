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
  description: "Exibe o TOP 5 de quem mais manda mensagem!",
  commands: ["rankativos", "ativos", "ranking"],
  usage: `${PREFIX}rankativos`,
  handle: async (props) => {
    // Pegando o sendReply das props, igual no trisal
    const { sendReply, remoteJid, isGroup } = props;

    try {
      if (!isGroup) return;

      const db = getDb();
      const groupId = remoteJid;

      if (!db[groupId] || Object.keys(db[groupId]).length === 0) {
        await sendReply("⚠️ O Manicômio ainda não registrou mensagens hoje.");
        return;
      }

      // Pega apenas o TOP 5
      const usuarios = Object.entries(db[groupId])
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.mensagens - a.mensagens)
        .slice(0, 5);

      let lista = `📊 *TOP 5 ATIVOS - MANICÔMIO*\n`;
      lista += `_Os pacientes mais falantes do Hospício_\n\n`;

      const mentions = [];

      usuarios.forEach((u, index) => {
        // Limpa o ID para pegar o número puro (baseado no trisal)
        const cleanId = u.id.split('@')[0].split(':')[0];
        const jidFinal = `${cleanId}@s.whatsapp.net`;
        
        mentions.push(jidFinal);
        lista += `${index + 1}. @${cleanId} — *${u.mensagens}* msgs\n`;
      });

      lista += `\n_Contagem baseada no histórico do bot._`;

      // Chama o sendReply passando o texto e a array de menções (igual ao trisal)
      await sendReply(lista, mentions);

    } catch (e) {
      console.log("Erro no ranking:", e.message);
    }
  },
};