import { PREFIX } from "../../../config.js";

export default {
  name: "cagatronco",
  description: "Gera o ranking dos 5 maiores caga tronco do grupo!",
  commands: ["cagatronco", "tronco", "topcaga", "entupidor"],
  usage: `${PREFIX}cagatronco`,
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
      await sendReply("O radar de encanamento só funciona em grupos! 🚽");
      return;
    }

    try {
      // 2. Puxa os membros do grupo
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length < 5) {
        await sendReply("Não tem gente suficiente para medir esses troncos! 🤨");
        return;
      }

      // 3. Embaralha todo mundo (100% aleatório)
      const shuffled = participants.sort(() => 0.5 - Math.random());
      
      // 4. Seleciona os 5 primeiros
      const top5 = shuffled.slice(0, 5);

      let response = `💩 *RANKING DOS 5 CAGA TRONCO* 💩\n_(Medição feita pelo sensor de pressão do vaso)_\n\n`;
      const mentions = [];

      top5.forEach((user, index) => {
        const number = user.id.split('@')[0];
        const pos = index + 1;
        
        // Emojis de destaque
        const medal = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : "👤";
        
        // Comentário para o campeão do desentupidor
        const extra = pos === 1 ? " (O ENTUPIDOR DE VASO) 🪵" : "";
        
        response += `${medal} ${pos}º - @${number}${extra}\n`;
        mentions.push(user.id);
      });

      response += `\n⚠️ *Alguém chama o encanador, porque o clima pesou!*`;

      // 5. Envia o ranking
      await sendReply(response, mentions);

    } catch (error) {
      console.error("Erro no comando cagatronco:", error);
      await sendReply("A descarga quebrou com tanto peso! Tente de novo. ⚠️");
    }
  },
};