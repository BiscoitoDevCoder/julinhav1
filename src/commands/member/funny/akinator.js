import pkg from 'akinator-api';
const { Aki } = pkg;

const sessions = {}; 

export default {
  name: "akinator",
  description: "O gênio que adivinha em quem você está pensando.",
  commands: ["aki", "akinator"],
  handle: async ({ socket, remoteJid, userLid, args, webMessage }) => {
    // ... O resto do código que te mandei antes continua igual ...
    
    // Se o usuário responder a uma pergunta do Akinator
    if (sessions[userLid]) {
      const aki = sessions[userLid];
      const resposta = args[0];

      if (["0", "1", "2", "3", "4"].includes(resposta)) {
        await aki.step(resposta);

        if (aki.progress >= 85 || aki.currentStep >= 30) {
          await aki.win();
          const personagem = aki.answers[0];
          
          delete sessions[userLid]; // Finaliza o jogo
          
          return await socket.sendMessage(remoteJid, {
            image: { url: personagem.absolute_picture_path },
            caption: `🧞‍♂️ *AKINATOR* 🧞‍♂️\n\nEu acho que é: *${personagem.name}*\n_${personagem.description}_\n\nAcertei? 😎`
          }, { quoted: webMessage });
        }

        const pergunta = `🧞‍♂️ *QUESTÃO ${aki.currentStep + 1}*\n\n` +
          `👉 *${aki.question}*\n\n` +
          `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
          `_Responda com !aki <numero>_`;

        return await socket.sendMessage(remoteJid, { text: pergunta }, { quoted: webMessage });
      }
    }

    // Iniciar novo jogo
    const aki = new Aki({ region: 'pt' });
    await aki.start();
    sessions[userLid] = aki;

    const inicio = `🧞‍♂️ *AKINATOR INICIADO*\n\nPense em um personagem real ou fictício e eu vou tentar adivinhar!\n\n` +
      `❓ *${aki.question}*\n\n` +
      `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
      `_Responda com !aki <numero>_`;

    await socket.sendMessage(remoteJid, { text: inicio }, { quoted: webMessage });
  }
};