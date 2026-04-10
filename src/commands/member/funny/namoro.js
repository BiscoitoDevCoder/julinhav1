import { PREFIX } from "../../../config.js";
/// Criamos um objeto global para armazenar os pedidos pendentes
if (!global.pedidosNamoro) global.pedidosNamoro = {};

export default {
  name: "namorar",
  description: "Peça alguém em namoro!",
  commands: ["namorar", "pedido", "casar"],
  usage: `${PREFIX}namorar @usuario`,
  handle: async (props) => {
    // Pegando as variáveis de forma segura
    const { sendReply, remoteJid, isGroup, userJid } = props;
    const mentions = props.mentions || []; // Garante que mentions seja ao menos uma lista vazia

    if (!isGroup) return;

    // AQUI ESTAVA O ERRO: Agora verificamos se existe a posição [0] antes de ler
    const citado = mentions.length > 0 ? mentions[0] : null;

    if (!citado) {
      return await sendReply(`⚠️ Você precisa marcar alguém para pedir em namoro! \nExemplo: ${PREFIX}namorar @usuario`);
    }

    if (citado === userJid) {
      return await sendReply("⚠️ Você não pode namorar você mesmo... tente marcar outra pessoa! 😂");
    }

    // Armazena o pedido
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