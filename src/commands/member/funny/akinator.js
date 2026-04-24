process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { Aki } from 'aki-api';

const sessions = {}; 

export default {
  name: "akinator",
  description: "O gênio que adivinha em quem você está pensando.",
  commands: ["aki", "akinator"],
  handle: async ({ socket, remoteJid, userLid, args, webMessage }) => {
    
    const region = 'pt';

    if (sessions[userLid]) {
      const aki = sessions[userLid];
      const resposta = args[0];

      if (["0", "1", "2", "3", "4"].includes(resposta)) {
        try {
          await aki.step(parseInt(resposta));

          if (aki.progress >= 80 || aki.currentStep >= 30) {
            await aki.win();
            const personagem = aki.answers[0];
            delete sessions[userLid];
            
            return await socket.sendMessage(remoteJid, {
              image: { url: personagem.absolute_picture_path },
              caption: `🧞‍♂️ *ADIVINHEI!* 🧞‍♂️\n\nEu acho que é: *${personagem.name}*\n_${personagem.description}_\n\nO Biscoitinho Play me treinou para ler mentes! 😎`
            }, { quoted: webMessage });
          }

          const pergunta = `🧞‍♂️ *QUESTÃO ${aki.currentStep + 1}*\n\n` +
            `👉 *${aki.question}*\n\n` +
            `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
            `_Responda com !aki <numero>_`;

          return await socket.sendMessage(remoteJid, { text: pergunta }, { quoted: webMessage });
        } catch (err) {
          console.error("Erro no passo do Akinator:", err.message);
          delete sessions[userLid];
          return await socket.sendMessage(remoteJid, { text: "❌ O gênio se confundiu ou foi bloqueado. Tente novamente." });
        }
      }
    }

    try {
      // CONFIGURAÇÃO COM DISFARCE (CAMUFLAGEM)
      const aki = new Aki({ 
        region, 
        childMode: false 
      });

      // Injetando um User-Agent de navegador real para evitar o Erro 403
      aki.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

      await aki.start();
      sessions[userLid] = aki;

      const inicio = `🧞‍♂️ *AKINATOR INICIADO*\n\nPense em alguém e eu vou tentar adivinhar!\n\n` +
        `❓ *${aki.question}*\n\n` +
        `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
        `_Responda com !aki <numero>_`;

      await socket.sendMessage(remoteJid, { text: inicio }, { quoted: webMessage });
    } catch (e) {
      console.error("Erro ao iniciar Akinator:", e.message);
      // Se der 403 aqui, o IP da VPS está realmente bloqueado.
      await socket.sendMessage(remoteJid, { text: "❌ O gênio detectou que sou um bot e me bloqueou (Erro 403). Tente mais tarde." });
    }
  }
};