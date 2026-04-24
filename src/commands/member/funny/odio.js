import { PREFIX } from "../../../config.js";

export default {
  name: "amorodio",
  description: "Mede aleatoriamente o nível de amor ou ódio entre duas pessoas",
  commands: ["amorodio", "ao"],
  usage: `${PREFIX}amorodio @mencione`,
  handle: async ({ socket, remoteJid, webMessage }) => {
    try {
      // --- CAPTURA DE ALVO (PADRÃO DO SEU BOT) ---
      const contextInfo = webMessage?.message?.extendedTextMessage?.contextInfo;
      
      // Pega o ID de quem foi mencionado ou de quem você respondeu a mensagem
      const mentioned = contextInfo?.mentionedJid?.[0];
      const quoted = contextInfo?.participant;
      
      const alvo = mentioned || quoted;

      if (!alvo) {
        return await socket.sendMessage(remoteJid, { 
          text: `❌ Você precisa mencionar @alguém ou responder a mensagem de alguém!` 
        });
      }

      // Captura quem enviou o comando
      const autor = webMessage.key.participant || webMessage.key.remoteJid;
      
      // IDs Privilegiados
      const vip1 = "263419571765312@lid";
      const vip2 = "107022733291775@lid";

      let tipoSorteado;
      let porcentagem;

      if ((autor === vip1 && alvo === vip2) || (autor === vip2 && alvo === vip1)) {
          tipoSorteado = "AMOR";
          porcentagem = Math.floor(Math.random() * (95 - 80 + 1)) + 80;
      } else {
          const tipos = ["AMOR", "ÓDIO"];
          tipoSorteado = tipos[Math.floor(Math.random() * tipos.length)];
          porcentagem = Math.floor(Math.random() * 101);
      }

      let emoji = tipoSorteado === "AMOR" ? "❤️" : "😡";
      let frase = "";
      
      if (tipoSorteado === "AMOR") {
          if (porcentagem >= 80) frase = "Isso aqui já é destino traçado! 💍";
          else if (porcentagem > 50) frase = "Tem um clima rolando hein... 👀";
          else frase = "Amizade colorida no máximo. 🎨";
      } else {
          if (porcentagem >= 80) frase = "Cuidado! É um passo de sair na mão! 🥊";
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

    } catch (error) {
      console.error("Erro no comando amorodio:", error);
    }
  },
};
