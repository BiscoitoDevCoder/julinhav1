import fs from "fs";

export default {
  name: "zerarranking",
  description: "Zera o ranking de ativos do grupo!",
  commands: ["zerarranking", "limparranking", "resetrank"],
  usage: ".zerarranking",
  handle: async ({ sendReply, remoteJid, isGroup }) => {
    // A única trava que mantive é a de ser em grupo, 
    // porque o ranking depende do ID do grupo (remoteJid)
    if (!isGroup) return;

    try {
      const databasePath = "./database/historico.json";
      
      if (fs.existsSync(databasePath)) {
        const db = JSON.parse(fs.readFileSync(databasePath, "utf-8"));
        
        if (db[remoteJid]) {
          delete db[remoteJid];
          fs.writeFileSync(databasePath, JSON.stringify(db, null, 2));
          return await sendReply("✅ O ranking de ativos deste grupo foi zerado com sucesso!");
        } else {
          return await sendReply("⚠️ Não encontrei nenhum dado de mensagens para este grupo.");
        }
      } else {
        return await sendReply("⚠️ O arquivo de histórico ainda não existe.");
      }
    } catch (e) {
      console.error(e);
      await sendReply("❌ Ocorreu um erro ao tentar zerar o ranking.");
    }
  },
};