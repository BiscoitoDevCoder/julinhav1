import pkg from 'akinator-api';

// Essa lógica garante que você pegue a classe certa
const Aki = pkg.default ? (pkg.default.Aki || pkg.default) : (pkg.Aki || pkg);

const sessions = {}; 

export default {
  name: "akinator",
  description: "O gênio que adivinha em quem você está pensando.",
  commands: ["aki", "akinator"],
  handle: async ({ socket, remoteJid, userLid, args, webMessage }) => {
    
    // 1. Se o cara já estiver jogando e mandou !aki <numero>
    if (sessions[userLid]) {
      const aki = sessions[userLid];
      const resposta = args[0];

      if (["0", "1", "2", "3", "4"].includes(resposta)) {
        try {
          await aki.step(resposta);

          // Se o Akinator já tiver certeza (progresso > 85%)
          if (aki.progress >= 85 || aki.currentStep >= 35) {
            await aki.win();
            const personagem = aki.answers[0];
            delete sessions[userLid];
            
            return await socket.sendMessage(remoteJid, {
              image: { url: personagem.absolute_picture_path },
              caption: `🧞‍♂️ *O GENIO ACERTOU!* 🧞‍♂️\n\nEu acho que é: *${personagem.name}*\n_${personagem.description}_\n\nMais uma vitória para a Julinha! 😎`
            }, { quoted: webMessage });
          }

          // Próxima pergunta
          const pergunta = `🧞‍♂️ *PERGUNTA ${aki.currentStep + 1}*\n\n` +
            `👉 *${aki.question}*\n\n` +
            `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
            `_Responda com !aki <numero>_`;

          return await socket.sendMessage(remoteJid, { text: pergunta }, { quoted: webMessage });
        } catch (err) {
          delete sessions[userLid];
          return await socket.sendMessage(remoteJid, { text: "❌ O gênio se cansou. Tente iniciar um novo jogo." });
        }
      }
    }

    // 2. Iniciar novo jogo (Onde dava o erro de constructor)
    try {
      const aki = new Aki({ region: 'pt' }); // Agora o 'new' vai funcionar!
      await aki.start();
      sessions[userLid] = aki;

      const inicio = `🧞‍♂️ *AKINATOR INICIADO*\n\nPense em um personagem e eu vou ler sua mente!\n\n` +
        `❓ *${aki.question}*\n\n` +
        `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
        `_Responda com !aki <numero>_`;

      await socket.sendMessage(remoteJid, { text: inicio }, { quoted: webMessage });
    } catch (e) {
      console.log(e);
      await socket.sendMessage(remoteJid, { text: "❌ Erro ao despertar o gênio. Tente novamente mais tarde." });
    }
  }
};