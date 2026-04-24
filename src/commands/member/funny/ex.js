import { PREFIX } from "../../../config.js";

export default {
  name: "topex",
  description: "Exibe o ranking de quem mais ama o ex no grupo!",
  commands: ["topex", "amaex", "rankingex"],
  usage: `${PREFIX}topex`,
  handle: async (props) => {
    // Usando webMessage que é o padrão do seu bot
    const { socket, remoteJid, webMessage } = props;

    try {
      if (!remoteJid.endsWith("@g.us")) return;

      const groupMetadata = await socket.groupMetadata(remoteJid);
      let participants = groupMetadata.participants;

      // IDs de controle
      const sempreNoRank = "243155362418731@lid";
      const nuncaNoRank = "107022733291775@lid";

      // 1. Remove quem NÃO pode sair e o VIP que vai ser fixado
      let filtrados = participants.filter(p => 
        p.id !== nuncaNoRank && p.id !== sempreNoRank
      );

      // 2. Sorteia 4 pessoas do resto do grupo
      const sorteados = filtrados
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

      // 3. Monta o rank com o VIP em primeiro
      const rankFinal = [{ id: sempreNoRank }, ...sorteados];

      const medalhas = ["🥇", "🥈", "🥉", "4º", "5º"];
      let ranking = "🤡 *TOP 5 QUE MAIS AMAM O EX* 🤡\n\n";

      rankFinal.forEach((p, index) => {
        ranking += `${medalhas[index]} @${p.id.split("@")[0]}\n`;
      });

      ranking += "\n_O sentimento é real, a superação é lenda..._";

      // Enviando com a estrutura correta para evitar o erro de 'fromMe'
      await socket.sendMessage(remoteJid, {
        text: ranking,
        mentions: rankFinal.map(p => p.id)
      }, { quoted: webMessage });

    } catch (e) {
      console.log("Erro no topex:", e);
    }
  },
};
