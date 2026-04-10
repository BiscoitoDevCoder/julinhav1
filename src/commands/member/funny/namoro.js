import { PREFIX } from "../../../config.js";
if (!global.pedidosNamoro) global.pedidosNamoro = {};

export default {
  name: "namorar",
  description: "Peça alguém em namoro!",
  commands: ["namorar", "pedido", "casar"],
  usage: `${PREFIX}namorar @usuario`,
  handle: async (props) => {
    const { sendReply, remoteJid, isGroup, userJid, fullMessage } = props;
    
    if (!isGroup) return;

    // 1. Tenta pegar o ID pela via oficial
    let citado = props.mentions?.[0] || 
                 fullMessage?.message?.extendedTextMessage?.contextInfo?.participant;

    // 2. SE FALHAR (o seu caso), vamos extrair o número do texto manualmente
    if (!citado) {
      // Pega o texto da mensagem (ex: "*namorar @5527999999999")
      const text = fullMessage?.message?.conversation || 
                   fullMessage?.message?.extendedTextMessage?.text || "";
      
      // Procura por números logo após o @
      const match = text.match(/@(\d+)/);
      if (match && match[1]) {
        citado = `${match[1]}@s.whatsapp.net`;
      }
    }

    if (!citado) {
      return await sendReply(`⚠️ O bot não conseguiu ler a marcação.\n\nDigite o comando e marque a pessoa com @ corretamente!`);
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

    await sendReply(texto, [userJid, citado]);
  },
};