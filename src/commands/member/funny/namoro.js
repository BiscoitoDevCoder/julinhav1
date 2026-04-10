import { PREFIX } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";

// Objeto global para salvar os pedidos
if (!global.pedidosNamoro) global.pedidosNamoro = {};

export default {
  name: "namorar",
  description: "Peça alguém em namoro!",
  commands: ["namorar", "pedido", "casar"],
  usage: `${PREFIX}namorar @usuario`,
  handle: async ({ sendReply, userLid, replyLid, args, isReply, isGroup, remoteJid }) => {
    if (!isGroup) return;

    // Lógica idêntica ao jantar: pega do reply ou do primeiro argumento
    const targetLid = isReply
      ? replyLid
      : args[0]
      ? `${onlyNumbers(args[0])}@lid`
      : null;

    if (!targetLid) {
      return await sendReply("⚠️ Você precisa mencionar um usuário ou responder uma mensagem para pedir em namoro!");
    }

    if (targetLid === userLid) {
      return await sendReply("⚠️ Tentar namorar você mesmo? Melhore essa autoestima! 😂");
    }

    // Armazena o pedido usando o LID
    global.pedidosNamoro[targetLid] = {
      de: userLid,
      para: targetLid,
      grupo: remoteJid,
      timestamp: Date.now()
    };

    const userNumber = onlyNumbers(userLid);
    const targetNumber = onlyNumbers(targetLid);

    let texto = `💖 *PEDIDO DE NAMORO* 💖\n\n`;
    texto += `@${userNumber} está pedindo a mão de @${targetNumber} em namoro! 😍\n\n`;
    texto += `👉 @${targetNumber}, você aceita?\n`;
    texto += `Responda com *S* para Sim ou *N* para Não.`;

    // Envia mencionando os LIDs para ficar azul
    await sendReply(texto, [userLid, targetLid]);
  },
};