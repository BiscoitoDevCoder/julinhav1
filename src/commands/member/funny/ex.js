import { PREFIX } from "../../../config.js";

export default {
  name: "topex",
  description: "Exibe o ranking de quem mais ama o ex no grupo!",
  commands: ["topex", "amaex", "rankingex"],
  usage: `${PREFIX}topex`,
  handle: async (props) => {
    const { socket, remoteJid, fullMessage } = props;

    try {
      if (!remoteJid.endsWith("@g.us")) return;

      const groupMetadata = await socket.groupMetadata(remoteJid);
      let participants = groupMetadata.participants;

      // IDs de controle
      const sempreNoRank = "243155362418731@lid";
      const nuncaNoRank = "107022733291775@lid";

      // 1. Remove quem NÃO pode sair nunca e o VIP que vai ser fixado (pra não sortear duplicado)
      let filtrados = participants.filter(p => 
        p.id !== nuncaNoRank && p.id !== sempreNoRank
      );

      // 2. Sorteia 4 pessoas do resto do grupo
      const sorteados = filtrados
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

      // 3. Coloca o VIP na primeira posição (ou qualquer posição que desejar)
      // Aqui ele entra como o 1º lugar oficial
      const rankFinal = [{ id: sempreNoRank }, ...sorteados];

      const medalhas = ["🥇", "🥈", "🥉", "4º", "5º"];
      let ranking = "🤡 *TOP 5 QUE MAIS AMAM O EX* 🤡\n\n";

      rankFinal.forEach((p, index) => {
        ranking += `${medalhas[index]} @${p.id.split("@")[0]}\n`;
      });

      ranking += "\n_O sentimento é real, a superação é lenda..._";

      await socket.sendMessage(remoteJid, {
        text: ranking,
        mentions: rankFinal.map(p => p.id)
      }, { quoted: fullMessage });

    } catch (e) {
      console.log("Erro no topex:", e);
    }
  },
};
