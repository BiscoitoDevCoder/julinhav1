import { PREFIX } from "../../../config.js";

export default {
  name: "tesao",
  description: "O bot revela quem está com fogo por quem no grupo!",
  commands: ["tesao", "fogo", "calor"],
  usage: `${PREFIX}tesao`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendReply,
    fullMessage,
    getGroupMetadata,
    userLid,
    remoteJid,
  }) => {
    // 1. Validação do JID (evita o erro de undefined)
    const jid = remoteJid || fullMessage?.key?.remoteJid;

    if (!jid || !jid.endsWith('@g.us')) {
      await sendReply("Esse comando é quente demais para o privado! Use em um grupo. 🔥");
      return;
    }

    try {
      // 2. Puxa os membros
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length < 2) {
        await sendReply("Preciso de pelo menos duas pessoas no grupo para medir esse calor! 🥵");
        return;
      }

      // 3. Sorteia duas pessoas diferentes aleatórias do grupo
      const shuffled = participants.sort(() => 0.5 - Math.random());
      const person1 = shuffled[0].id;
      const person2 = shuffled[1].id;

      // 4. Gera uma porcentagem aleatória de 50% a 100% (pra ficar engraçado)
      const porcentagem = Math.floor(Math.random() * 51) + 50;

      // 5. Limpa os números
      const num1 = person1.split('@')[0];
      const num2 = person2.split('@')[0];

      // 6. Envia o veredito
      await sendReply(
        `🥵 *MEDIDOR DE CALOR* 🥵\n\nO clima esquentou! O bot detectou que:\n\n@${num1} está com *${porcentagem}%* de tesão por @${num2}! 🔥🔞\n\nAlguém traz um balde de gelo ou um quarto! 🧊`,
        [person1, person2]
      );
    } catch (error) {
      console.error("Erro no comando tesao:", error);
      await sendReply("O termômetro quebrou de tanto calor! Tente novamente. ⚠️");
    }
  },
};