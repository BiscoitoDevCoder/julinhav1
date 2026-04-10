import { PREFIX } from "../../../config.js";
/// Criamos um objeto global para armazenar os pedidos pendentes
if (!global.pedidosNamoro) global.pedidosNamoro = {};

export default {
  name: "namorar",
  description: "Peça alguém em namoro!",
  commands: ["namorar", "pedido", "casar"],
  usage: `${PREFIX}namorar @usuario`,
  handle: async (props) => {
    const { sendReply, remoteJid, isGroup, userJid, fullMessage } = props;
    
    if (!isGroup) return;

    // 1. Tenta pegar por menção direta, ou por quem você respondeu (quoted), ou da lista de mentions
    const mentions = props.mentions || [];
    const quotedMsg = fullMessage?.message?.extendedTextMessage?.contextInfo?.participant;
    
    const citado = mentions[0] || quotedMsg;

    if (!citado) {
      return await sendReply(`⚠️ Você precisa marcar alguém ou responder à mensagem da pessoa!\nExemplo: ${PREFIX}namorar @usuario`);
    }

    if (citado === userJid) {
      return await sendReply("⚠️ Tentar namorar você mesmo? Melhore essa autoestima! 😂");
    }

    // Armazena o pedido no objeto global
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