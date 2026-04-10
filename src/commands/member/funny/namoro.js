import { PREFIX } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";

if (!global.pedidosNamoro) global.pedidosNamoro = {};

export default {
  name: "namorar",
  description: "Peça alguém em namoro!",
  commands: ["namorar", "pedido", "casar"],
  usage: `${PREFIX}namorar @usuario`,
  handle: async ({ sendReply, userLid, replyLid, args, isReply, isGroup, remoteJid }) => {
    if (!isGroup) return;

    const targetLid = isReply ? replyLid : args[0] ? `${onlyNumbers(args[0])}@lid` : null;

    if (!targetLid) {
      return await sendReply("⚠️ Você precisa mencionar um usuário ou responder uma mensagem!");
    }

    // --- TRAVA DE EXCLUSIVIDADE COM MARCAÇÃO ---
    const pessoaExclusiva = "162474837987395@lid";
    const donoExclusivo = "107022733291775@lid";

    if (targetLid === pessoaExclusiva && userLid !== donoExclusivo) {
      const donoNumero = onlyNumbers(donoExclusivo);
      return await sendReply(
        `❌ Desculpe betinha, essa pessoa tem dono! Pergunta pro @${donoNumero} se ele deixa... (spoiler: não deixa).`,
        [donoExclusivo]
      );
    }
    // ------------------------------------------

    if (targetLid === userLid) {
      return await sendReply("⚠️ Você não pode namorar você mesmo! 😂");
    }

    // Salva o pedido na memória global
    global.pedidosNamoro[targetLid] = {
      de: userLid,
      para: targetLid,
      grupo: remoteJid
    };

    const userNumber = onlyNumbers(userLid);
    const targetNumber = onlyNumbers(targetLid);

    await sendReply(
      `💖 *PEDIDO DE NAMORO* 💖\n\n` +
      `@${userNumber} pediu a mão de @${targetNumber} em namoro! 😍\n\n` +
      `👉 @${targetNumber}, você aceita?\n` +
      `Responda com *S* para Sim ou *N* para Não.`,
      [userLid, targetLid]
    );
  },
};