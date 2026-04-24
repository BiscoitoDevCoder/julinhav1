import { PREFIX } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";
export default {
  name: "chance",
  description: "Calcula a probabilidade de algo acontecer.",
  commands: ["chance", "porcentagem"],
  handle: async ({ socket, remoteJid, userLid, args, webMessage }) => {
    // 1. Verifica se o usuário escreveu a pergunta
    if (!args.length) {
      return await socket.sendMessage(remoteJid, { 
        text: "❓ Você precisa dizer do que quer saber a chance! Ex: !chance do @user ser corno" 
      }, { quoted: webMessage });
    }

    const userNumber = onlyNumbers(userLid);
    const pergunta = args.join(" ");
    
    // 2. Gera a porcentagem aleatória
    const porcentagem = Math.floor(Math.random() * 101);

    // 3. Resposta curta e direta
    const resposta = `🔮 *ORÁCULO DO MANICÔMIO*\n\n` +
      `❓ *Pergunta:* ${pergunta}\n` +
      `⚖️ *Chance:* ${porcentagem}%\n\n` +

    await socket.sendMessage(remoteJid, {
      text: resposta,
      mentions: [userLid]
    }, { quoted: webMessage });
  },
};
