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
              caption: `🧞‍♂️ *O GENIO LEU SUA MENTE!* 🧞‍♂️\n\nEu acho que é: *${personagem.name}*\n_${personagem.description}_\n\nBiscoitinho me ensinou bem! 😎`
            }, { quoted: webMessage });
          }

          const pergunta = `🧞‍♂️ *QUESTÃO ${aki.currentStep + 1}*\n\n` +
            `👉 *${aki.question}*\n\n` +
            `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
            `_Responda com !aki <numero>_`;

          return await socket.sendMessage(remoteJid, { text: pergunta }, { quoted: webMessage });
        } catch (err) {
          console.error("Erro no passo:", err.message);
          delete sessions[userLid];
          return await socket.sendMessage(remoteJid, { text: "❌ O gênio se cansou. Tente novamente." });
        }
      }
    }

    try {
      // Criamos a instância
      const aki = new Aki({ region, childMode: false });

      // CONFIGURAÇÃO DE CAMUFLAGEM PESADA
      // Isso simula um Chrome atualizado no Windows 10
      aki.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';
      
      // Alguns servidores checam se você aceita linguagem em português
      aki.headers = {
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://pt.akinator.com/',
        'Origin': 'https://pt.akinator.com/'
      };

      await aki.start();
      sessions[userLid] = aki;

      const inicio = `🧞‍♂️ *AKINATOR INICIADO*\n\nPense em alguém e eu vou tentar adivinhar!\n\n` +
        `❓ *${aki.question}*\n\n` +
        `0 - Sim\n1 - Não\n2 - Não sei\n3 - Provavelmente sim\n4 - Provavelmente não\n\n` +
        `_Responda com !aki <numero>_`;

      await socket.sendMessage(remoteJid, { text: inicio }, { quoted: webMessage });
    } catch (e) {
      console.error("Erro no Start:", e.message);
      
      if (e.message.includes('403')) {
          await socket.sendMessage(remoteJid, { text: "❌ *BLOQUEIO DE SEGURANÇA*\n\nO servidor do Akinator bloqueou o IP da VPS. Eles não permitem robôs nessa rede hoje. 😔\n\n_Dica: Tente o comando !ia ou !simsimi_" });
      } else {
          await socket.sendMessage(remoteJid, { text: "❌ Erro ao despertar o gênio." });
      }
    }
  }
};