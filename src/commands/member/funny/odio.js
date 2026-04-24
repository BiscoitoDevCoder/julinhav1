import { PREFIX } from "../../config.js";

export default {
  name: "amorodio",
  description: "Mede aleatoriamente o nível de amor ou ódio entre duas pessoas",
  commands: ["amorodio", "ao"],
  handle: async ({ socket, remoteJid, fullMessage }) => {
    const mentioned = fullMessage?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const quoted = fullMessage?.message?.extendedTextMessage?.contextInfo?.participant;
    const alvo = mentioned || quoted;

    if (!alvo) {
      return await socket.sendMessage(remoteJid, { 
        text: `❌ Você precisa mencionar ou responder a mensagem de alguém para medir o sentimento!` 
      });
    }

    const autor = fullMessage.key.participant || fullMessage.key.remoteJid;
    
    const vip1 = "263419571765312@lid";
    const vip2 = "107022733291775@lid";

    let tipoSorteado;
    let porcentagem;

    if ((autor === vip1 && alvo === vip2) || (autor === vip2 && alvo === vip1)) {
        tipoSorteado = "AMOR";
        porcentagem = Math.floor(Math.random() * (90 - 80 + 1)) + 80;
    } else {
        const tipos = ["AMOR", "ÓDIO"];
        tipoSorteado = tipos[Math.floor(Math.random() * tipos.length)];
        porcentagem = Math.floor(Math.random() * 101);
    }

    let emoji = "";
    let frase = "";
    
    if (tipoSorteado === "AMOR") {
        emoji = "❤️";
        if (porcentagem >= 80) frase = "Isso aqui já é destino traçado! 💍";
        else if (porcentagem > 50) frase = "Tem um clima rolando hein... 👀";
        else frase = "Amizade colorida no máximo. 🎨";
    } else {
        emoji = "😡";
        if (porcentagem > 80) frase = "Cuidado! É um passo de sair na mão! 🥊";
        else if (porcentagem > 50) frase = "O ranço está instalado com sucesso. 🤮";
        else frase = "Uma leve pontada de falsidade. 🐍";
    }

    const progresso = "▓".repeat(Math.floor(porcentagem / 10)) + "░".repeat(10 - Math.floor(porcentagem / 10));

    const resposta = `⚖️ *MEDIDOR DE SENTIMENTOS* ⚖️\n\n` +
      `👤 *De:* @${autor.split('@')[0]}\n` +
      `👤 *Para:* @${alvo.split('@')[0]}\n\n` +
      `O veredito da Julinha é: **${tipoSorteado}**\n` +
      `Nível: [${progresso}] ${porcentagem}%\n\n` +
      `${emoji} ${frase}`;

    await socket.sendMessage(remoteJid, { 
      text: resposta, 
      mentions: [autor, alvo] 
    });
  },
};
