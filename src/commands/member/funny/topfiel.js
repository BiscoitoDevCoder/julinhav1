import { PREFIX } from "../../../config.js";

export default {
  name: "topfiel",
  description: "Gera o ranking das 5 pessoas mais fiéis do grupo!",
  commands: ["topfiel", "maisfieldogrupo", "fidelidade"],
  usage: `${PREFIX}topfiel`,
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
      await sendReply("A prova de fidelidade só pode ser feita em grupos! 💍");
      return;
    }

    try {
      // 2. Puxa os membros do grupo
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length < 5) {
        await sendReply("O grupo precisa de pelo menos 5 pessoas para esse ranking! 🤨");
        return;
      }

      // 3. Embaralha todo mundo de forma justa (Sem manipulação)
      const shuffled = participants.sort(() => 0.5 - Math.random());
      
      // 4. Pega os 5 primeiros
      const top5 = shuffled.slice(0, 5);

      let response = `💍 *RANKING DA FIDELIDADE (TOP 5)* 💍\n_(Sorteio 100% aleatório e auditado)_\n\n`;
      const mentions = [];

      top5.forEach((user, index) => {
        const number = user.id.split('@')[0];
        const pos = index + 1;
        
        // Emojis de destaque
        const medal = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : "👤";
        
        response += `${medal} ${pos}º - @${number}\n`;
        mentions.push(user.id);
      });

      response += `\n✨ *Esses aqui você pode levar para conhecer a família!*`;

      // 5. Envia o ranking marcando os sorteados
      await sendReply(response, mentions);

    } catch (error) {
      console.error("Erro no comando topfiel:", error);
      await sendReply("Ocorreu um erro ao medir o caráter do grupo! Tente de novo. ⚠️");
    }
  },
};