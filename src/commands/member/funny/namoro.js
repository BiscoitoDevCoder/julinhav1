import { PREFIX } from "../../../config.js";
if (!global.pedidosNamoro) global.pedidosNamoro = {};

export default {
  name: "namorar",
  description: "Peça alguém em namoro!",
  commands: ["namorar", "pedido", "casar"],
  usage: `${PREFIX}namorar @usuario`,
  handle: async (props) => {
    const { sendReply, remoteJid, isGroup, userJid, fullMessage, m } = props;
    
    if (!isGroup) return;

    // --- CAÇA-ID: Procurando o alvo em todos os cantos ---
    // 1. Pela lista de mentions oficial do props
    // 2. Pelas mensagens citadas (quoted)
    // 3. Pelo contexto da mensagem bruta (Baileys padrão)
    const citado = 
      (props.mentions && props.mentions[0]) || 
      m?.message?.extendedTextMessage?.contextInfo?.participant ||
      fullMessage?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
      fullMessage?.message?.extendedTextMessage?.contextInfo?.participant;

    if (!citado) {
      return await sendReply(`⚠️ O bot não reconheceu a marcação.\nTente digitar o comando respondendo a uma mensagem da pessoa!`);
    }

    if (citado === userJid) {
      return await sendReply("⚠️ Você não pode namorar você mesmo! 😂");
    }

    // Registra o pedido
    global.pedidosNamoro[citado] = {
      de: userJid,
      para: citado,
      grupo: remoteJid,
      timestamp: Date.now()
    };

    const deNumero = userJid.split('@')[0];
    const paraNumero = citado.split('@')[0];

    let texto = `💖 *PEDIDO DE NAMORO* 💖\n\n`;
    texto += `@${deNumero} pediu @${paraNumero} em namoro! 😍\n\n`;
    texto += `👉 @${paraNumero}, você aceita?\n`;
    texto += `Responda com *S* (Sim) ou *N* (Não).`;

    // Garante que o bot mencione os dois para o WhatsApp ativar o azul
    await sendReply(texto, [userJid, citado]);
  },
};