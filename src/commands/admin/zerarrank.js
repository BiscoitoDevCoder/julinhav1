import { PREFIX } from "../../config.js";
import fs from "fs";

const databasePath = "./database/historico.json";

export default {
  name: "zerarranking",
  description: "Zera o ranking de ativos do grupo!",
  commands: ["zerarranking", "limparranking", "resetrank"],
  usage: `${PREFIX}zerarranking`,
  handle: async ({ sendReply, remoteJid, isGroup, isGroupAdmins, isOwner }) => {
    if (!isGroup) return;

    // Só permite se for Admin do grupo ou Dono do bot
    if (!isGroupAdmins && !isOwner) {
      return await sendReply("❌ Apenas administradores podem resetar o ranking.");
    }

    try {
      if (fs.existsSync(databasePath)) {
        const db = JSON.parse(fs.readFileSync(databasePath, "utf-8"));
        
        if (db[remoteJid]) {
          delete db[remoteJid];
          fs.writeFileSync(databasePath, JSON.stringify(db, null, 2));
          return await sendReply("✅ O ranking de ativos foi zerado com sucesso!");
        } else {
          return await sendReply("⚠️ Não há dados de mensagens para este grupo.");
        }
      }
    } catch (e) {
      console.error(e);
      await sendReply("❌ Erro ao tentar zerar o ranking.");
    }
  },
};