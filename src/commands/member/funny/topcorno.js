import { PREFIX } from "../../../config.js";

export default {
  name: "topcornos",
  description: "Exibe o ranking dos maiores cornos do grupo!",
  commands: ["topcornos", "cornos", "rankingcorno"],
  usage: `${PREFIX}topcornos`,
  handle: async (props) => {
    // Vamos extrair apenas o essencial
    const { socket, remoteJid, fullMessage } = props;

    try {
      // Verifica se é grupo
      if (!remoteJid.endsWith("@g.us")) return;

      const groupMetadata = await socket.groupMetadata(remoteJid);
      const participants = groupMetadata.participants;

      // Sorteia 5
      const sorteados = participants
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      const medalhas = ["🥇", "🥈", "🥉", "4º", "5º"];
      let ranking = "🐂 *RANKING DOS MAIORES CORNOS* 🐂\n\n";

      sorteados.forEach((p, index) => {
        ranking += `${medalhas[index]} @${p.id.split("@")[0]}\n`;
      });

      // Enviando direto pelo socket para não depender de funções internas que dão erro
      await socket.sendMessage(remoteJid, {
        text: ranking,
        mentions: sorteados.map(p => p.id)
      }, { quoted: fullMessage });

    } catch (e) {
      console.log("Erro no topcornos:", e);
    }
  },
};