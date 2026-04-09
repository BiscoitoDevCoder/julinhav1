import { PREFIX } from "../../../config.js";

export default {
  name: "bucetudas",
  description: "Gera o ranking das 7 mais bucetudas do grupo!",
  commands: ["bucetudas", "topbucetudas", "bucetuda"],
  usage: `${PREFIX}bucetudas`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendReply,
    fullMessage,
    getGroupMetadata,
    remoteJid,
  }) => {
    // 1. Validação do JID para evitar erros de undefined
    const jid = remoteJid || fullMessage?.key?.remoteJid;

    if (!jid || !jid.endsWith('@g.us')) {
      await sendReply("Esse comando só pode ser usado em grupos! 🌸");
      return;
    }

    try {
      // 2. Puxa os membros do grupo
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length < 7) {
        await sendReply("O grupo precisa de pelo menos 7 pessoas para esse ranking! 🤨");
        return;
      }

      // 3. Embaralha todo mundo de forma justa (sem marmelada)
      const shuffled = participants.sort(() => 0.5 - Math.random());
      
      // 4. Pega as 7 primeiras pessoas
      const top7 = shuffled.slice(0, 7);

      let response = `✨ *RANKING DAS 7 MAIS BUCETUDAS* ✨\n_(Sorteio aleatório e sem erro)_\n\n`;
      const mentions = [];

      top7.forEach((user, index) => {
        const number = user.id.split('@')[0];
        const pos = index + 1;
        
        // Emojis de destaque para o pódio
        const medal = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : "👤";
        
        response += `${medal} ${pos}º - @${number}\n`;
        mentions.push(user.id);
      });

      response += `\n🚨 *A ciência do bot não falha! Quem não gostou, reclama com o VAR.*`;

      // 5. Envia o ranking marcando as sorteadas (ou sorteados, na zoeira)
      await sendReply(response, mentions);

    } catch (error) {
      console.error("Erro no comando bucetudas:", error);
      await sendReply("Deu um erro na análise! Tente de novo. ⚠️");
    }
  },
};