import { PREFIX } from "../../../config.js";

export default {
  name: "amo",
  description: "O bot revela quem você ama no grupo!",
  commands: ["amo", "amor", "quemamo"],
  usage: `${PREFIX}amo`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendReply,
    fullMessage,
    getGroupMetadata,
    userLid,
    remoteJid, // Pegando o JID direto das props
  }) => {
    // 1. Validação do ID do grupo (evita o erro de undefined)
    const jid = remoteJid || fullMessage?.key?.remoteJid;

    if (!jid || !jid.endsWith('@g.us')) {
      await sendReply("Ei! Esse comando de cupido só funciona em grupos! 🏹");
      return;
    }

    try {
      // 2. Puxa os membros do grupo com segurança
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length === 0) {
        await sendReply("Não consegui ver quem está no grupo. O bot é admin? 🤨");
        return;
      }

      // 3. Filtra para você não se auto-sortear
      const otherParticipants = participants.filter(p => p.id !== userLid);

      if (otherParticipants.length === 0) {
        await sendReply("Você é a única pessoa no grupo... O amor próprio é tudo! 😅");
        return;
      }

      // 4. Sorteia uma pessoa aleatória
      const randomLove = otherParticipants[Math.floor(Math.random() * otherParticipants.length)].id;

      // 5. Limpa os números para a mensagem
      const senderNumber = userLid.split('@')[0];
      const loveNumber = randomLove.split('@')[0];

      // 6. Envia a declaração
      await sendReply(
        `❤️ *DECLARAÇÃO DE AMOR* ❤️\n\n@${senderNumber} assumiu para todo mundo que seu coração bate mais forte por @${loveNumber}! 💘✨\n\nSerá que esse casal vinga? 😏`,
        [userLid, randomLove]
      );
    } catch (error) {
      console.error("Erro no comando amo:", error);
      await sendReply("Deu um erro técnico aqui no meu coração (banco de dados). Tente de novo! ⚠️");
    }
  },
};