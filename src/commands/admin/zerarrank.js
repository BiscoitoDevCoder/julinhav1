import fs from "fs";

export default {
  name: "zerarranking",
  description: "Zera o ranking de ativos do grupo!",
  commands: ["zerarranking", "limparranking", "resetrank"],
  usage: ".zerarranking",
  handle: async (props) => {
    const { sendReply, remoteJid, isGroup, isGroupAdmins, isOwner, fullMessage } = props;
    
    if (!isGroup) return;

    // Seu LID alvo
    const myLid = "107022733291775@lid";
    
    // Pega o ID de quem enviou de todos os lugares possíveis
    const sender = fullMessage?.key?.participant || fullMessage?.key?.remoteJid || "";
    
    // Verifica se você é Admin, se é Owner ou se o seu ID/LID bate
    const canExecute = isOwner || isGroupAdmins || sender.includes(myLid) || sender.includes("107022733291775");

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
          return await sendReply("✅ Ranking zerado com sucesso!");
        }
      }
      await sendReply("⚠️ Não há dados de ranking acumulados aqui.");
    } catch (e) {
      console.error(e);
      await sendReply("❌ Erro ao processar o reset.");
    }
  },
};