import fs from "fs";

export default {
  name: "zerarranking",
  description: "Zera o ranking de ativos do grupo!",
  commands: ["zerarranking", "limparranking", "resetrank"],
  usage: ".zerarranking",
  handle: async (props) => {
    const { sendReply, remoteJid, fullMessage, m } = props;

    // Seus dados para bater
    const myLid = "107022733291775@lid";
    const myJid = "5527992928373@s.whatsapp.net";
    
    // Tenta pegar o ID de 4 lugares diferentes
    const sender1 = fullMessage?.key?.participant;
    const sender2 = fullMessage?.participant;
    const sender3 = m?.key?.participant;
    const sender4 = m?.participant;

    // Se qualquer um desses bater com você, libera
    const isMaster = [sender1, sender2, sender3, sender4].some(id => id === myLid || id === myJid);

    if (!isMaster) {
      // Se barrar, ele vai mostrar o que ele achou em cada lugar (Debug)
      return await sendReply(`❌ Acesso negado.\nS1: ${sender1}\nS2: ${sender2}`);
    }

    try {
      const databasePath = "./database/historico.json";
      if (fs.existsSync(databasePath)) {
        const db = JSON.parse(fs.readFileSync(databasePath, "utf-8"));
        if (db[remoteJid]) {
          delete db[remoteJid];
          fs.writeFileSync(databasePath, JSON.stringify(db, null, 2));
          return await sendReply("✅ Agora sim! Ranking zerado com sucesso.");
        }
      }
      await sendReply("⚠️ Não há dados para este grupo.");
    } catch (e) {
      await sendReply("❌ Erro no banco de dados.");
    }
  },
};