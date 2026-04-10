import fs from "fs";
import path from "path";

const databasePath = path.resolve("database", "historico.json");

export default {
  name: "zerarranking",
  description: "Zera o ranking de ativos do grupo!",
  commands: ["zerarranking", "limparranking", "resetrank"],
  usage: `.zerarranking`,
  handle: async ({ sendReply, remoteJid, isGroup }) => {
    if (!isGroup) return;

    try {
      if (fs.existsSync(databasePath)) {
        const db = JSON.parse(fs.readFileSync(databasePath, "utf-8"));
        
        // Zera apenas os dados DESTE grupo específico
        if (db[remoteJid]) {
          delete db[remoteJid];
          fs.writeFileSync(databasePath, JSON.stringify(db, null, 2));
          return await sendReply("✅ O ranking de ativos deste grupo foi zerado com sucesso!");
        } else {
          return await sendReply("⚠️ Não há dados de ranking para este grupo.");
        }
      }
    } catch (e) {
      console.error(e);
      await sendReply("❌ Ocorreu um erro ao tentar zerar o ranking.");
    }
  },
};