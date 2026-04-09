import { PREFIX } from "../../../config.js";

export default {
  name: "trisal",
  description: "O bot forma um trisal aleatório no grupo!",
  commands: ["trisal", "formartrisal"],
  usage: `${PREFIX}trisal`,
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
      await sendReply("Trisal só funciona em grupo, a bagunça é maior! 😈");
      return;
    }

    try {
      // 2. Puxa os membros do grupo
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      // 3. Verifica se tem pelo menos 3 pessoas
      if (!participants || participants.length < 3) {
        await sendReply("Não tem gente suficiente aqui para um trisal! Chame mais gente. 😉");
        return;
      }

      // 4. Embaralha e sorteia 3 pessoas diferentes
      const shuffled = participants.sort(() => 0.5 - Math.random());
      const p1 = shuffled[0].id;
      const p2 = shuffled[1].id;
      const p3 = shuffled[2].id;

      // 5. Limpa os números para a mensagem
      const num1 = p1.split('@')[0];
      const num2 = p2.split('@')[0];
      const num3 = p3.split('@')[0];

      // 6. Envia a mensagem com as marcações
      await sendReply(
        `✨ *NOVA UNIÃO FORMADA!* ✨\n\nO destino jogou os dados e decidiu que estes três agora são um trisal:\n\n👤 @${num1}\n👤 @${num2}\n👤 @${num3}\n\n💖 *Amor de sobra para todos!* 💖`,
        [p1, p2, p3] // Marca os três
      );
    } catch (error) {
      console.error("Erro no comando trisal:", error);
      await sendReply("Os três se desentenderam e o comando deu erro! Tente de novo. ⚠️");
    }
  },
};