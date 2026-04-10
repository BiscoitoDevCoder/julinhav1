import fs from "fs";

export default {
  name: "zerarranking",
  description: "Zera o ranking de ativos do grupo!",
  commands: ["zerarranking", "limparranking", "resetrank"],
  usage: ".zerarranking",
  handle: async ({ sendReply, remoteJid, isGroup, isGroupAdmins, isOwner, userJid }) => {
    if (!isGroup) return;

    // Seu LID específico para garantir que só você tenha o poder supremo
    const myLid = "107022733291775@lid";
    
    // Se você for o dono pelo LID, ignora qualquer outra trava
    const canExecute = isOwner || isGroupAdmins || userJid === myLid;

    if (!canExecute) {
      return await sendReply("❌ Apenas administradores ou o dono podem resetar o ranking.");
    }

    try {
      const databasePath = "./database/historico.json";
      
      if (fs.existsSync(databasePath)) {
        const db = JSON.parse(fs.readFileSync(databasePath, "utf-8"));
        
        if (db[remoteJid]) {
          delete db[remoteJid];
          fs.writeFileSync(databasePath, JSON.stringify(db, null, 2));
          return await sendReply("✅ O ranking do Manicômio foi resetado via LID!");
        }
      }
      await sendReply("⚠️ Não há dados de ranking para este grupo.");
    } catch (e) {
      console.error("Erro ao zerar ranking:", e);
      await sendReply("❌ Erro interno ao tentar limpar os dados.");
    }
  },
};