import { PREFIX } from "../../../config.js";

export default {
  name: "topracistas",
  description: "O bot gera o ranking dos 10 mais racistas do grupo (zoeira)!",
  commands: ["topracistas", "rankingracistas"],
  usage: `${PREFIX}topracistas`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendReply,
    fullMessage,
    getGroupMetadata,
    remoteJid,
  }) => {
    // 1. Validação do JID
    const jid = remoteJid || fullMessage?.key?.remoteJid;

    if (!jid || !jid.endsWith('@g.us')) {
      await sendReply("Este ranking só pode ser gerado em grupos! 📋");
      return;
    }

    try {
      // 2. Puxa os membros do grupo
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length < 5) {
        await sendReply("O grupo precisa de mais gente para um Top 10! 🤨");
        return;
      }

      // 3. Embaralha os membros e pega os 10 primeiros
      const shuffled = participants.sort(() => 0.5 - Math.random());
      const top10 = shuffled.slice(0, 10);

      // 4. Monta a lista do ranking
      let response = `⚠️ *RANKING DOS 10 MAIS RACISTAS* ⚠️\n_(Baseado em absolutamente nada, apenas zoeira)_\n\n`;
      const mentions = [];

      top10.forEach((user, index) => {
        const number = user.id.split('@')[0];
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "👤";
        response += `${medal} ${index + 1}º - @${number}\n`;
        mentions.push(user.id);
      });

      response += `\n🚨 *Cuidado com esses elementos!* 🚨`;

      // 5. Envia o ranking marcando todo mundo da lista
      await sendReply(response, mentions);

    } catch (error) {
      console.error("Erro no comando topracistas:", error);
      await sendReply("Ocorreu um erro ao gerar o ranking. Tente novamente! ⚠️");
    }
  },
};