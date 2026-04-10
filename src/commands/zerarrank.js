import fs from "fs";
import path from "path";

// Usamos ./ para garantir que ele pegue a pasta da raiz do bot
const databasePath = "./database/historico.json";

export default {
  name: "zerarranking",
  description: "Zera o ranking de ativos do grupo!",
  commands: ["zerarranking", "limparranking", "resetrank"],
  usage: `.zerarranking`,
  handle: async ({ sendReply, remoteJid, isGroup, isGroupAdmins, isOwner }) => {
    // 1. Só funciona em grupo
    if (!isGroup) return;

    // 2. Trava de segurança: Só o dono do bot ou admins do grupo podem zerar
    if (!isGroupAdmins && !isOwner) {
      return await sendReply("❌ Apenas administradores podem zerar o ranking!");
    }

    try {
      if (fs.existsSync(databasePath)) {
        const db = JSON.parse(fs.readFileSync(databasePath, "utf-8"));
        
        if (db[remoteJid]) {
          delete db[remoteJid];
          fs.writeFileSync(databasePath, JSON.stringify(db, null, 2));
          return await sendReply("✅ O Manicômio foi resetado! O ranking de ativos agora está zerado.");
        } else {
          return await sendReply("⚠️ Não encontrei nenhum dado de mensagens deste grupo para zerar.");
        }
      } else {
        return await sendReply("⚠️ O arquivo de banco de dados ainda não foi criado.");
      }
    } catch (e) {
      console.error("Erro ao zerar ranking:", e);
      await sendReply("❌ Erro interno ao tentar limpar o JSON.");
    }
  },
};