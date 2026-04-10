import { PREFIX } from "../../config.js";

// Criamos um objeto global para armazenar os pedidos pendentes
if (!global.pedidosNamoro) global.pedidosNamoro = {};

export default {
  name: "namorar",
  description: "Peça alguém em namoro!",
  commands: ["namorar", "pedido", "casar"],
  usage: `${PREFIX}namorar @usuario`,
  handle: async ({ sendReply, remoteJid, isGroup, mentions, userJid }) => {
    if (!isGroup) return;

    const citado = mentions[0];
    if (!citado) return await sendReply(`⚠️ Você precisa marcar alguém! Ex: ${PREFIX}namorar @usuario`);
    if (citado === userJid) return await sendReply("⚠️ Você não pode namorar você mesmo... ou pode? Mas o bot não deixa! 😂");

    // Armazena o pedido: Quem pediu, para quem pediu e em qual grupo
    global.pedidosNamoro[citado] = {
      de: userJid,
      para: citado,
      grupo: remoteJid,
      timestamp: Date.now()
    };

    const deNumero = userJid.split('@')[0];
    const paraNumero = citado.split('@')[0];

    let texto = `💖 *PEDIDO DE NAMORO* 💖\n\n`;
    texto += `@${deNumero} está pedindo a mão de @${paraNumero} em namoro! 😍\n\n`;
    texto += `👉 @${paraNumero}, você aceita?\n`;
    texto += `Responda com *S* para Sim ou *N* para Não.`;

    await sendReply(texto, [userJid, citado]);
  },
};