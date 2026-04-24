import { PREFIX } from "../../../config.js";

export default {
  name: "amorodio",
  description: "Mede aleatoriamente o nível de amor ou ódio entre duas pessoas",
  commands: ["amorodio", "ao"],
  usage: `${PREFIX}amorodio @mencione`,
  handle: async ({ socket, remoteJid, fullMessage }) => {
    try {
      // --- CAPTURA DE ALVO REFORÇADA ---
      const contextInfo = fullMessage?.message?.extendedTextMessage?.contextInfo;
      
      // 1. Tenta pegar por marcação (@)
      // 2. Tenta pegar por resposta (Reply/Quoted)
      const mentioned = contextInfo?.mentionedJid?.[0];
      const quoted = contextInfo?.participant;
      
      const alvo = mentioned || quoted;

      // Se não houver alvo, avisa o usuário
      if (!alvo) {
        return await socket.sendMessage(remoteJid, { 
          text: `❌ Você precisa mencionar @alguém ou responder a mensagem de alguém para medir o sentimento!` 
        });
      }

      // Captura quem enviou o comando
      const autor = fullMessage.key.participant || fullMessage.key.remoteJid;
      
      // IDs Privilegiados (LIDs para manipulação)
      const vip1 = "263419571765312@lid";
      const vip2 = "107022733291775@lid";

      let tipoSorteado;
      let porcentagem;

      // --- LÓGICA DE MANIPULAÇÃO DO CASAL VIP ---
      if ((autor === vip1 && alvo === vip2) || (autor === vip2 && alvo === vip1)) {
          tipoSorteado = "AMOR";
          // Gera nota alta entre 80 e 95%
          porcentagem = Math.floor(Math.random() * (95 - 80 + 1)) + 80;
      } else {
          // Sorteio normal para o resto do grupo
          const tipos = ["AMOR", "ÓDIO"];
          tipoSorteado = tipos[Math.floor(Math.random() * tipos.length)];
          porcentagem = Math.floor(Math.random() * 101);
      }

      // --- DEFINIÇÃO DE EMOJIS E FRASES ---
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

      // Monta a barrinha visual (ex: ▓▓▓▓░░░░░░)
      const progresso = "▓".repeat(Math.floor(porcentagem / 10)) + "░".repeat(10 - Math.floor(porcentagem / 10));

      const resposta = `⚖️ *MEDIDOR DE SENTIMENTOS* ⚖️\n\n` +
        `👤 *De:* @${autor.split('@')[0]}\n` +
        `👤 *Para:* @${alvo.split('@')[0]}\n\n` +
        `O veredito da Julinha é: **${tipoSorteado}**\n` +
        `Nível: [${progresso}] ${porcentagem}%\n\n` +
        `${emoji} ${frase}`;

      // Envia a mensagem marcando os dois
      await socket.sendMessage(remoteJid, { 
        text: resposta, 
        mentions: [autor, alvo] 
      });

    } catch (error) {
      console.error("Erro no comando amorodio:", error);
    }
  },
};
