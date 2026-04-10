import { PREFIX } from "../../../config.js";

export default {
  name: "topcornos",
  description: "Exibe o ranking dos maiores cornos do grupo!",
  commands: ["topcornos", "cornos", "rankingcorno"],
  usage: `${PREFIX}topcornos`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendReply,
    remoteJid,
    socket,
    fullMessage
  }) => {
    // 1. Pega os membros do grupo
    const groupMetadata = await socket.groupMetadata(remoteJid);
    const participants = groupMetadata.participants;

    // 2. Embaralha e escolhe 5 "vítimas"
    const sorteados = participants
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    // 3. Monta a lista com as medalhas
    const medalhas = ["🥇", "🥈", "🥉", "4º", "5º"];
    let ranking = "🐂 *RANKING DOS MAIORES CORNOS* 🐂\n_Cuidado, o chifre tá batendo no teto!_\n\n";

    sorteados.forEach((p, index) => {
      ranking += `${medalhas[index]} @${p.id.split("@")[0]}\n`;
    });

    ranking += "\n⚠️ *Status:* Chifre de ouro detectado!";

    // 4. Envia a resposta marcando a galera
    await socket.sendMessage(remoteJid, {
      text: ranking,
      mentions: sorteados.map(p => p.id)
    }, { quoted: fullMessage });
  },
};