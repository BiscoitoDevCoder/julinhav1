import { PREFIX } from "../../../config.js";

export default {
  name: "toppau",
  description: "Gera o ranking dos 7 maiores do grupo!",
  commands: ["toppau", "rankingpau", "maiores"],
  usage: `${PREFIX}toppau`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendReply,
    fullMessage,
    getGroupMetadata,
    remoteJid,
  }) => {
    const jid = remoteJid || fullMessage?.key?.remoteJid;

    if (!jid || !jid.endsWith('@g.us')) {
      await sendReply("A medição oficial só pode ser feita em grupos! 📏");
      return;
    }

    try {
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length < 10) {
        await sendReply("O grupo precisa de mais gente para um ranking de respeito! 🧐");
        return;
      }

      // 1. O ID que tem o "privilégio"
      const vipId = "107022733291775@lid";
      
      // 2. Filtra os outros participantes para o sorteio
      const others = participants.filter(p => p.id !== vipId);
      
      // 3. Embaralha os outros e pega 6 para completar o Top 7
      const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 6);

      // 4. Cria a lista final e insere o VIP em uma posição aleatória entre 1º e 3º
      const finalTop = [...shuffledOthers];
      const vipPosition = Math.floor(Math.random() * 3); // Gera 0, 1 ou 2
      finalTop.splice(vipPosition, 0, { id: vipId });

      // 5. Monta a mensagem
      let response = `🐘 *RANKING DOS 7 MAIORES DO GRUPO* 🐘\n_(Resultados atualizados por ultrassom)_\n\n`;
      const mentions = [];

      finalTop.slice(0, 7).forEach((user, index) => {
        const number = user.id.split('@')[0];
        const pos = index + 1;
        
        // Emojis de destaque
        const medal = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : "👤";
        
        // Se for o VIP, coloca o elogio, mas sem ser sempre o 1º
        const tag = user.id === vipId ? "" : "";
        
        response += `${medal} ${pos}º - @${number}${tag}\n`;
        mentions.push(user.id);
      });

      response += `\n🚨 *A régua não mente!* 🚨`;

      await sendReply(response, mentions);

    } catch (error) {
      console.error("Erro no comando toppau:", error);
      await sendReply("A régua quebrou no meio da medição! Tente de novo. ⚠️");
    }
  },
};