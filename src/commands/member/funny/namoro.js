// Subindo 3 níveis para chegar na pasta SRC onde está o config.js
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

    // Ajuste para pegar o LID corretamente
    const targetLid = isReply ? replyLid : args[0] ? `${onlyNumbers(args[0])}@lid` : null;

    if (!targetLid) {
      return await sendReply("⚠️ Você precisa mencionar um usuário ou responder uma mensagem!");
    }

    // --- CONFIGURAÇÃO DE EXCLUSIVIDADE ---
    const pessoaExclusiva = "162474837987395@lid"; // ID da Letícia
    const donoExclusivo = "107022733291775@lid";   // Seu ID (Jadson)

    // 1. Trava: Ninguém pede a Letícia (exceto você)
    if (targetLid === pessoaExclusiva && userLid !== donoExclusivo) {
      const donoNumero = onlyNumbers(donoExclusivo);
      return await sendReply(
        `❌ Desculpe betinha, essa pessoa tem dono! Pergunta pro @${donoNumero} se ele deixa... (spoiler: não deixa).`,
        { mentions: [donoExclusivo] }
      );
    }

    // 2. Trava: A Letícia não pode pedir mais ninguém
    if (userLid === pessoaExclusiva) {
      return await sendReply("❌ Você já tem o seu dono! Não saia por aí pedindo outros em namoro. 😉");
    }

    // 3. Trava: Você não pode pedir mais ninguém (fidelidade!)
    if (userLid === donoExclusivo && targetLid !== pessoaExclusiva) {
      return await sendReply("❌ Você já tem a sua patroa exclusiva! Pra que procurar outra? 😂");
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
      { mentions: [userLid, targetLid] }
    );
  },
};