import { PREFIX } from "../../../config.js";

export default {
  name: "topinfiel",
  description: "Gera o ranking dos 10 mais infiéis do grupo!",
  commands: ["topinfiel", "rankinginfiel"],
  usage: `${PREFIX}topinfiel`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ sendReply, fullMessage, getGroupMetadata, remoteJid }) => {
    const jid = remoteJid || fullMessage?.key?.remoteJid;

    if (!jid || !jid.endsWith('@g.us')) {
      await sendReply("Este ranking só pode ser gerado em grupos! 📋");
      return;
    }

    try {
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length < 5) {
        await sendReply("O grupo precisa de mais gente para um Top 10 de infiéis! 🤨");
        return;
      }

      const shuffled = participants.sort(() => 0.5 - Math.random());
      const top10 = shuffled.slice(0, 10);

      let response = `🚩 *RANKING DOS 10 MAIS INFIEIS* 🚩\n_(Cuidado, a fidelidade aqui é zero!)_\n\n`;
      const mentions = [];

      top10.forEach((user, index) => {
        const number = user.id.split('@')[0];
        const emoji = index === 0 ? "👑" : index < 3 ? "🐍" : "👣";
        response += `${emoji} ${index + 1}º - @${number}\n`;
        mentions.push(user.id);
      });

      response += `\n📢 *Alô namorados(as), fiquem de olho!*`;
      await sendReply(response, mentions);
    } catch (error) {
      await sendReply("Erro ao gerar o ranking de traição. ⚠️");
    }
  },
};