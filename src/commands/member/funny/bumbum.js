import { PREFIX } from "../../../config.js";

export default {
  name: "guloso",
  description: "Gera o ranking dos 7 bumbuns gulosos do grupo!",
  commands: ["guloso", "bumbum", "topguloso", "rabo"],
  usage: `${PREFIX}guloso`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendReply,
    fullMessage,
    getGroupMetadata,
    remoteJid,
  }) => {
    // 1. Validação do JID para evitar o erro de undefined
    const jid = remoteJid || fullMessage?.key?.remoteJid;

    if (!jid || !jid.endsWith('@g.us')) {
      await sendReply("O radar de bumbum só funciona em grupos! 🍑");
      return;
    }

    try {
      // 2. Puxa os membros do grupo
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length < 7) {
        await sendReply("Não tem gente suficiente aqui para esse ranking guloso! 🤨");
        return;
      }

      // 3. Embaralha todo mundo de forma justa
      const shuffled = participants.sort(() => 0.5 - Math.random());
      
      // 4. Seleciona os 7 primeiros
      const top7 = shuffled.slice(0, 7);

      let response = `🍑 *RANKING DOS BUMBUNS GULOSOS* 🍑\n_(Analisado pelo sensor de pressão do bot)_\n\n`;
      const mentions = [];

      top7.forEach((user, index) => {
        const number = user.id.split('@')[0];
        const pos = index + 1;
        
        // Emojis para o pódio
        const medal = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : "👤";
        
        // Comentário para o campeão
        const extra = pos === 1 ? " (O MAIOR DEVORADOR) 🕳️" : "";
        
        response += `${medal} ${pos}º - @${number}${extra}\n`;
        mentions.push(user.id);
      });

      response += `\n🚨 *Cuidado! Esse ranking não perdoa ninguém.*`;

      // 5. Envia o ranking marcando a galera
      await sendReply(response, mentions);

    } catch (error) {
      console.error("Erro no comando guloso:", error);
      await sendReply("O sensor entupiu com tanto peso! Tente de novo. ⚠️");
    }
  },
};