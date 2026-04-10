import fs from "fs";

export default {
  name: "zerarranking",
  description: "Zera o ranking de ativos do grupo!",
  commands: ["zerarranking", "limparranking", "resetrank"],
  usage: ".zerarranking",
  handle: async (props) => {
    const { sendReply, remoteJid, fullMessage } = props;

    // Identificador único do Jadson (LID)
    const myLid = "107022733291775";
    
    // Pega o ID de quem mandou a mensagem (pode vir como JID ou LID)
    const sender = fullMessage?.key?.participant || "";

    // SE NÃO FOR VOCÊ (pelo LID), o bot vai barrar.
    if (!sender.includes(myLid)) {
      return await sendReply("❌ Apenas o Jadson (Dono) pode resetar o ranking!");
    }

    // Se passou daqui, é porque é você!
    try {
      const databasePath = "./database/historico.json";
      
      if (fs.existsSync(databasePath)) {
        const db = JSON.parse(fs.readFileSync(databasePath, "utf-8"));
        
        if (db[remoteJid]) {
          delete db[remoteJid];
          fs.writeFileSync(databasePath, JSON.stringify(db, null, 2));
          return await sendReply("✅ O ranking do Manicômio foi resetado com sucesso por você!");
        }
      }
      await sendReply("⚠️ Não encontrei dados para zerar neste grupo.");
    } catch (e) {
      console.error(e);
      await sendReply("❌ Erro ao acessar o arquivo de banco de dados.");
    }
  },
};