import { onlyNumbers } from "../../../utils/index.js";

// Objeto para salvar o tempo da última fofoca de cada pessoa
const cooldowns = {};

export default {
  name: "x9",
  description: "Envia uma fofoca anônima para o grupo.",
  commands: ["x9", "fofoca", "anonimo"],
  handle: async ({ socket, remoteJid, userLid, args, isGroup }) => {
    // 1. Bloqueia se for usado dentro de um grupo (para manter o anonimato)
    if (isGroup) {
      return await socket.sendMessage(remoteJid, { 
        text: "🤫 Esse comando só funciona no meu privado para ninguém saber quem é o X9!" 
      });
    }

    // 2. Sistema de Cooldown (5 minutos = 300.000 ms)
    const agora = Date.now();
    const tempoEspera = 5 * 60 * 1000;

    if (cooldowns[userLid] && (agora - cooldowns[userLid]) < tempoEspera) {
      const restante = Math.ceil((tempoEspera - (agora - cooldowns[userLid])) / 1000 / 60);
      return await socket.sendMessage(remoteJid, { 
        text: `⏳ Calma, dedo de seta! Você já mandou uma fofoca. Espere mais ${restante} minuto(s).` 
      });
    }

    // 3. Verifica se enviou a fofoca
    if (!args.length) {
      return await socket.sendMessage(remoteJid, { 
        text: "📝 Como vou contar a fofoca se você não escreveu nada? Ex: *x9 o @user tá namorando" 
      });
    }

    const fofoca = args.join(" ");
    
    // ID DO GRUPO CONFIGURADO
    const grupoJid = "120363427549469145@g.us"; 

    // 4. Envia para o grupo
    await socket.sendMessage(grupoJid, {
      text: `📢 *FUXICO DO X9 (ANÔNIMO)*\n\n" ${fofoca} "\n\n_Disseram por aí... será que é verdade?_ 🤫`
    });

    // 5. Salva o tempo atual no cooldown e confirma pro usuário
    cooldowns[userLid] = agora;
    
    await socket.sendMessage(remoteJid, { 
      text: "✅ A fofoca foi plantada com sucesso!" 
    });
  },
};