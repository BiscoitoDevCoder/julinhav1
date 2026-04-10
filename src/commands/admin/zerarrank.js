import fs from "fs";

export default {
  name: "zerarranking",
  description: "Zera o ranking de ativos do grupo!",
  commands: ["zerarranking", "limparranking", "resetrank"],
  usage: ".zerarranking",
  handle: async (props) => {
    const { sendReply, remoteJid, fullMessage } = props;

    // As duas formas que o seu bot pode te enxergar
    const myLid = "107022733291775@lid";
    const myJid = "5527992056721@s.whatsapp.net"; // Coloquei seu número de Cariacica/ES
    
    // Pega o ID de quem mandou de forma bruta
    const sender = fullMessage?.key?.participant || "";

    // Se o remetente contiver o seu LID OU o seu JID, ele libera
    const isMaster = sender.includes(myLid) || sender.includes(myJid);

    if (!isMaster) {
      return await sendReply(`❌ Acesso negado. Seu ID atual é: ${sender.split('@')[0]}`);
    }

    try {
      const databasePath = "./database/historico.json";
      
      if (fs.existsSync(databasePath)) {
        const db = JSON.parse(fs.readFileSync(databasePath, "utf-8"));
        
        if (db[remoteJid]) {
          delete db[remoteJid];
          fs.writeFileSync(databasePath, JSON.stringify(db, null, 2));
          return await sendReply("✅ Ranking resetado com sucesso, Jadson!");
        }
      }
      await sendReply("⚠️ Não há dados de ranking para este grupo.");
    } catch (e) {
      await sendReply("❌ Erro ao acessar o banco de dados.");
    }
  },
};