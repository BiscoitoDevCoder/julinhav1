import { PREFIX } from "../../../config.js";

export default {
  name: "lindos",
  description: "Gera o ranking das 5 pessoas mais lindas do grupo!",
  commands: ["lindos", "toplindos", "beleza"],
  usage: `${PREFIX}lindos`,
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
      await sendReply("A beleza só pode ser apreciada em grupos! ✨");
      return;
    }

    try {
      const metadata = await getGroupMetadata(jid);
      const participants = metadata?.participants;

      if (!participants || participants.length < 5) {
        await sendReply("O grupo precisa de mais gente para esse ranking! 🤨");
        return;
      }

      const vipId = "162474837987395@lid";
      
      // 1. Sorteio de probabilidade (0 a 100)
      const sorteioSorte = Math.floor(Math.random() * 100);
      let finalTop = [];

      if (sorteioSorte < 85) {
        // --- LOGICA DOS 85%: FORÇA NO TOPO ---
        const others = participants.filter(p => p.id !== vipId);
        const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 4);
        
        // Sorteia entre 1º ou 2º lugar
        const posVip = Math.floor(Math.random() * 2);
        finalTop = [...shuffledOthers];
        finalTop.splice(posVip, 0, { id: vipId });
      } else {
        // --- LOGICA DOS 15%: SORTEIO 100% REAL ---
        finalTop = participants.sort(() => 0.5 - Math.random()).slice(0, 5);
      }

      // 2. Monta a mensagem limpa
      let response = `✨ *RANKING DA PERFEIÇÃO (TOP 5)* ✨\n\n`;
      const mentions = [];

      finalTop.slice(0, 5).forEach((user, index) => {
        const number = user.id.split('@')[0];
        const pos = index + 1;
        const medal = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : "👤";
        
        response += `${medal} ${pos}º - @${number}\n`;
        mentions.push(user.id);
      });

      response += `\n💖 *A beleza está nos olhos de quem vê!*`;

      await sendReply(response, mentions);

    } catch (error) {
      console.error("Erro no comando lindos:", error);
      await sendReply("Ocorreu um erro ao analisar o grupo! Tente de novo. ⚠️");
    }
  },
};