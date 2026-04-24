import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Aki } = require('akinator-api');

const sessions = {}; 

export default {
  name: "akinator",
  description: "O gênio que adivinha em quem você está pensando.",
  commands: ["aki", "akinator"],
  handle: async ({ socket, remoteJid, userLid, args, webMessage }) => {
    
    // 1. Se o usuário já estiver em uma partida
    if (sessions[userLid]) {
      const aki = sessions[userLid];
      const resposta = args[0];

      if (["0", "1", "2", "3", "4"].includes(resposta)) {
        try {
          await aki.step(resposta);

          if (aki.progress >= 80 || aki.currentStep >= 35) {
            await aki.win();
            const personagem = aki.answers[0];
            delete sessions[userLid];
            
            return await socket.sendMessage(remoteJid, {
              image: { url: personagem.absolute_picture_path },
              caption: `🧞‍♂️ *EU LI SUA MENTE!* 🧞‍♂️\n\nEu acho que é: *${personagem.name}*\n_${personagem.description}_\n\nO Biscoitinho Play me treinou bem! 😎`
            }, { quoted: webMessage });
          }

          const pergunta = `🧞‍♂️ *PERGUNTA ${aki.currentStep + 1}*\n\n` +
            `👉 *${aki.question}*\n\n` +
            `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
            `_Responda com !aki <numero>_`;

          return await socket.sendMessage(remoteJid, { text: pergunta }, { quoted: webMessage });
        } catch (err) {
          delete sessions[userLid];
          return await socket.sendMessage(remoteJid, { text: "❌ O gênio se atrapalhou. Tente novamente." });
        }
      }
    }

    // 2. Iniciar novo jogo
    try {
      // O 'require' acima garante que o Aki seja um construtor válido agora
      const aki = new Aki({ region: 'pt' }); 
      await aki.start();
      sessions[userLid] = aki;

      const inicio = `🧞‍♂️ *AKINATOR INICIADO*\n\nPense em alguém e eu vou tentar adivinhar!\n\n` +
        `❓ *${aki.question}*\n\n` +
        `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
        `_Responda com !aki <numero>_`;

      await socket.sendMessage(remoteJid, { text: inicio }, { quoted: webMessage });
    } catch (e) {
      console.error(e);
      await socket.sendMessage(remoteJid, { text: "❌ Erro ao despertar o gênio." });
    }
  }
};