import { PREFIX } from "../../../config.js";

export default {
  name: "gostoso",
  description: "O bot escolhe quem é a pessoa mais gostosa do grupo!",
  commands: ["gostoso", "gostosa", "top"],
  usage: `${PREFIX}gostoso`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendReply,
    fullMessage,
    getGroupMetadata,
    remoteJid, // Usamos o remoteJid direto das props se disponível
  }) => {
    // 1. Garante que temos o ID do grupo
    const jid = remoteJid || fullMessage?.key?.remoteJid;

    if (!jid || !jid.endsWith('@g.us')) {
      await sendReply("Este comando só pode ser usado em grupos! ❌");
      return;
    }

    try {
      // 2. Puxa a lista de membros do grupo
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length === 0) {
        await sendReply("Não consegui carregar a lista de membros. 🤨");
        return;
      }

      // 3. Sorteia uma pessoa aleatória
      const randomPerson = participants[Math.floor(Math.random() * participants.length)].id;
      const number = randomPerson.split('@')[0];

      // 4. Envia o veredito
      await sendReply(
        `🔥 *O VEREDITO DOS DEUSES* 🔥\n\nA ciência, a estética e o bot confirmam: a pessoa mais gostosa desse grupo é @${number}! 🏆✨\n\nPodem admirar, mas com respeito! 😏`,
        [randomPerson]
      );
    } catch (error) {
      console.error("Erro ao pegar metadata:", error);
      await sendReply("Erro ao tentar acessar os membros do grupo. Verifique se sou admin! ⚠️");
    }
  },
};