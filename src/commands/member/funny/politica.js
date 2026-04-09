import { PREFIX } from "../../../config.js";

export default {
  name: "rankpolitica",
  description: "Gera o ranking dos 5 mais bolsonaristas e 5 mais petistas do grupo!",
  commands: ["rankpolitica", "polarizacao", "eleicoes"],
  usage: `${PREFIX}rankpolitica`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendReply,
    fullMessage,
    getGroupMetadata,
    remoteJid,
  }) => {
    // 1. Validação do JID para evitar erro de undefined
    const jid = remoteJid || fullMessage?.key?.remoteJid;

    if (!jid || !jid.endsWith('@g.us')) {
      await sendReply("O debate político só é permitido em grupos! 🏛️");
      return;
    }

    try {
      // 2. Puxa os membros do grupo
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length < 10) {
        await sendReply("O grupo está muito vazio para uma eleição! Preciso de pelo menos 10 pessoas. 🗳️");
        return;
      }

      // 3. Embaralha os membros para o sorteio aleatório
      const shuffled = participants.sort(() => 0.5 - Math.random());
      
      // 4. Divide: 5 para cada lado
      const bolsonaristas = shuffled.slice(0, 5);
      const petistas = shuffled.slice(5, 10);

      let response = `🇧🇷 *GRANDE DEBATE DO GRUPO* 🇧🇷\n\n`;
      const mentions = [];

      // Lista dos Bolsonaristas
      response += `🇧🇷 *TOP 5 BOLSONARISTAS* 🔫\n`;
      bolsonaristas.forEach((user, index) => {
        const number = user.id.split('@')[0];
        response += `${index + 1}º - @${number}\n`;
        mentions.push(user.id);
      });

      response += `\n⭐ *TOP 5 PETISTAS* 🚩\n`;
      // Lista dos Petistas
      petistas.forEach((user, index) => {
        const number = user.id.split('@')[0];
        response += `${index + 1}º - @${number}\n`;
        mentions.push(user.id);
      });

      response += `\nO clima esquentou! Quem ganha essa briga? 👀👇`;

      // 5. Envia o ranking marcando os 10 envolvidos
      await sendReply(response, mentions);

    } catch (error) {
      console.error("Erro no comando rankpolitica:", error);
      await sendReply("Houve uma fraude nas urnas (erro técnico)! Tente de novo. ⚠️");
    }
  },
};