import pkg from 'akinator-api';
// Isso aqui garante que vamos pegar a classe Aki corretamente
const Aki = pkg.default ? pkg.default.Aki : pkg.Aki;

const sessions = {}; 

export default {
  name: "akinator",
  description: "O gênio que adivinha em quem você está pensando.",
  commands: ["aki", "akinator"],
  handle: async ({ socket, remoteJid, userLid, args, webMessage }) => {
    
    // Se o usuário já estiver jogando e responder (ex: !aki 0)
    if (sessions[userLid]) {
      const aki = sessions[userLid];
      const resposta = args[0];

      if (["0", "1", "2", "3", "4"].includes(resposta)) {
        await aki.step(resposta);

        // Se o Akinator já tiver certeza (progresso > 85%) ou muitas perguntas
        if (aki.progress >= 85 || aki.currentStep >= 30) {
          await aki.win();
          const personagem = aki.answers[0];
          
          delete sessions[userLid];
          
          return await socket.sendMessage(remoteJid, {
            image: { url: personagem.absolute_picture_path },
            caption: `🧞‍♂️ *EU ADIVINHEI!* 🧞‍♂️\n\nEu acho que é: *${personagem.name}*\n_${personagem.description}_\n\nO mestre Biscoitinho me ensinou bem! 😎`
          }, { quoted: webMessage });
        }

        // Próxima pergunta
        const pergunta = `🧞‍♂️ *PERGUNTA ${aki.currentStep + 1}*\n\n` +
          `👉 *${aki.question}*\n\n` +
          `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
          `_Responda com !aki <numero>_`;

        return await socket.sendMessage(remoteJid, { text: pergunta }, { quoted: webMessage });
      }
    }

    // Iniciar novo jogo caso não tenha sessão ativa
    try {
      const aki = new Aki({ region: 'pt' }); // Agora o 'new Aki' vai funcionar!
      await aki.start();
      sessions[userLid] = aki;

      const inicio = `🧞‍♂️ *AKINATOR INICIADO*\n\nPense em alguém e eu vou tentar ler sua mente!\n\n` +
        `❓ *${aki.question}*\n\n` +
        `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
        `_Responda com !aki <numero>_`;

      await socket.sendMessage(remoteJid, { text: inicio }, { quoted: webMessage });
    } catch (e) {
      console.log(e);
      await socket.sendMessage(remoteJid, { text: "❌ Erro ao despertar o gênio. Tente novamente." });
    }
  }
};