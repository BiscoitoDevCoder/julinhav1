import { PREFIX } from "../../../config.js";

export default {
  name: "cearense",
  description: "Gera o ranking dos 7 maiores cabeças de cearense do grupo!",
  commands: ["cearense", "cabeca", "topcearense", "ceara"],
  usage: `${PREFIX}cearense`,
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
      await sendReply("Esse radar de cabeçorra só funciona em grupos! 🏜️");
      return;
    }

    try {
      // 2. Puxa os membros do grupo
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length < 7) {
        await sendReply("Não tem gente suficiente para medir essas cabeças! 🤨");
        return;
      }

      // 3. Embaralha todo mundo (sem marmelada)
      const shuffled = participants.sort(() => 0.5 - Math.random());
      
      // 4. Pega os 7 primeiros
      const top7 = shuffled.slice(0, 7);

      let response = `🏜️ *RANKING CABEÇA DE CEARENSE* 🏜️\n_(Medição via satélite em tempo real)_\n\n`;
      const mentions = [];

      top7.forEach((user, index) => {
        const number = user.id.split('@')[0];
        const pos = index + 1;
        
        // Emojis de destaque
        const medal = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : "👤";
        
        // Comentário extra para o primeiro lugar
        const extra = pos === 1 ? " (CAIXA D'ÁGUA) 📦" : "";
        
        response += `${medal} ${pos}º - @${number}${extra}\n`;
        mentions.push(user.id);
      });

      response += `\n⚠️ *Cuidado ao passar em portas estreitas!*`;

      // 5. Envia o ranking
      await sendReply(response, mentions);

    } catch (error) {
      console.error("Erro no comando cearense:", error);
      await sendReply("O GPS se perdeu nessa testa gigante! Tente de novo. ⚠️");
    }
  },
};