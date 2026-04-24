import { PREFIX } from "../../../config.js";

export default {
  name: "topex",
  description: "Exibe o ranking de quem mais ama o ex no grupo!",
  commands: ["topex", "amaex", "rankingex"],
  usage: `${PREFIX}topex`,
  handle: async (props) => {
    const { socket, remoteJid, webMessage } = props;

    try {
      if (!remoteJid.endsWith("@g.us")) return;

      const groupMetadata = await socket.groupMetadata(remoteJid);
      let participants = groupMetadata.participants;

      // ID que continua proibido de aparecer no rank
      const nuncaNoRank = "107022733291775@lid";

      // 1. Filtra a lista apenas para remover quem não pode sair nunca
      let filtrados = participants.filter(p => p.id !== nuncaNoRank);

      // 2. Sorteia 5 pessoas de forma totalmente aleatória
      const sorteados = filtrados
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      const medalhas = ["🥇", "🥈", "🥉", "4º", "5º"];
      let ranking = "🤡 *TOP 5 QUE MAIS AMAM O EX* 🤡\n\n";

      sorteados.forEach((p, index) => {
        ranking += `${medalhas[index]} @${p.id.split("@")[0]}\n`;
      });

      ranking += "\n_O sentimento é real, a superação é lenda..._";

      await socket.sendMessage(remoteJid, {
        text: ranking,
        mentions: sorteados.map(p => p.id)
      }, { quoted: webMessage });

    } catch (e) {
      console.log("Erro no topex:", e);
    }
  },
};
