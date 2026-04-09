import { PREFIX } from "../../../config.js";

export default {
  name: "peitos",
  description: "Gera o ranking dos 7 maiores peitos do grupo (100% aleatório)!",
  commands: ["peitos", "toppeitos", "peituda", "peitudo"],
  usage: `${PREFIX}peitos`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendReply,
    fullMessage,
    getGroupMetadata,
    remoteJid,
  }) => {
    // 1. Validação do JID para evitar erros
    const jid = remoteJid || fullMessage?.key?.remoteJid;

    if (!jid || !jid.endsWith('@g.us')) {
      await sendReply("Esse comando só pode ser usado em grupos! 🥥🥥");
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

      // 3. Embaralha TODO MUNDO de forma aleatória (Sem manipulação)
      const shuffled = participants.sort(() => 0.5 - Math.random());
      
      // 4. Pega os 7 primeiros após o embaralhamento
      const top7 = shuffled.slice(0, 7);

      let response = `🥥 *RANKING DOS 7 MAIORES PEITOS* 🥥\n_(Sorteio 100% aleatório e sem marmelada)_\n\n`;
      const mentions = [];

      top7.forEach((user, index) => {
        const number = user.id.split('@')[0];
        const pos = index + 1;
        
        // Emojis de posição
        const medal = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : "👤";
        
        response += `${medal} ${pos}º - @${number}\n`;
        mentions.push(user.id);
      });

      response += `\n⚠️ *O veredito do bot é final! Aceitem ou chorem.*`;

      // 5. Envia o ranking marcando os sorteados
      await sendReply(response, mentions);

    } catch (error) {
      console.error("Erro no comando peitos:", error);
      await sendReply("Ocorreu um erro ao medir o tamanho! Tente de novo. ⚠️");
    }
  },
};