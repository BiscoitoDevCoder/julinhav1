process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { Aki } from 'aki-api';
// ... resto do código igual ao anterior

import { Aki } from 'aki-api';

const sessions = {}; 

export default {
  name: "akinator",
  description: "O gênio que adivinha em quem você está pensando.",
  commands: ["aki", "akinator"],
  handle: async ({ socket, remoteJid, userLid, args, webMessage }) => {
    
    const region = 'pt';

    // 1. Se o usuário já estiver jogando
    if (sessions[userLid]) {
      const aki = sessions[userLid];
      const resposta = args[0];

      // aki-api usa índices de 0 a 4
      if (["0", "1", "2", "3", "4"].includes(resposta)) {
        try {
          await aki.step(parseInt(resposta));

          // Se o progresso for alto, ele tenta adivinhar
          if (aki.progress >= 80 || aki.currentStep >= 30) {
            await aki.win();
            const personagem = aki.answers[0];
            delete sessions[userLid];
            
            return await socket.sendMessage(remoteJid, {
              image: { url: personagem.absolute_picture_path },
              caption: `🧞‍♂️ *ADIVINHEI!* 🧞‍♂️\n\nEu acho que é: *${personagem.name}*\n_${personagem.description}_\n\nO Biscoitinho Play me treinou para ler mentes! 😎`
            }, { quoted: webMessage });
          }

          // Próxima pergunta
          const pergunta = `🧞‍♂️ *QUESTÃO ${aki.currentStep + 1}*\n\n` +
            `👉 *${aki.question}*\n\n` +
            `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
            `_Responda com !aki <numero>_`;

          return await socket.sendMessage(remoteJid, { text: pergunta }, { quoted: webMessage });
        } catch (err) {
          console.error(err);
          delete sessions[userLid];
          return await socket.sendMessage(remoteJid, { text: "❌ O gênio se confundiu. Tente novamente." });
        }
      }
    }

    // 2. Iniciar novo jogo
    try {
      const aki = new Aki({ region }); 
      await aki.start();
      sessions[userLid] = aki;

      const inicio = `🧞‍♂️ *AKINATOR INICIADO*\n\nPense em alguém e eu vou tentar adivinhar!\n\n` +
        `❓ *${aki.question}*\n\n` +
        `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
        `_Responda com !aki <numero>_`;

      await socket.sendMessage(remoteJid, { text: inicio }, { quoted: webMessage });
    } catch (e) {
      console.error(e);
      await socket.sendMessage(remoteJid, { text: "❌ Erro ao despertar o gênio. Verifique sua conexão." });
    }
  }
};