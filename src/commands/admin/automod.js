// Lista de palavras proibidas (Regex para pegar variações com proteção de palavras compostas)
const palavrasProibidas = [
  // --- Ideologias e Ódio ---
  /\bnazi\b/gi, 
  /\bnazista\b/gi, 
  /\bnazismo\b/gi, 
  /\bhitler\b/gi, 
  /卐/g, 
  
  // --- Racismo ---
  /\bracista\b/gi, 
  /\bmacaco\b/gi, 
  /\bpreto\b/gi, 
  /\bnigga\b/gi,
  
  // --- Ofensas de Baixo Calão ---
  /\bputa\b/gi, 
  /\bvagabunda\b/gi, 
  /\brapariga\b/gi
];

export default {
  name: "antifiltro",
  handle: async ({ socket, remoteJid, fullMessage, deleteMessage }) => {
    // 1. Pega o texto da mensagem (conversa, texto estendido ou legenda)
    const messageText = 
      fullMessage?.message?.conversation || 
      fullMessage?.message?.extendedTextMessage?.text || 
      fullMessage?.message?.imageMessage?.caption || 
      "";

    // 2. Verifica se a mensagem contém alguma palavra da lista
    const temPalavraProibida = palavrasProibidas.some((regex) => regex.test(messageText));

    if (temPalavraProibida) {
      try {
        // 3. Identifica o infrator para marcar no aviso
        const infrator = fullMessage.key.participant || fullMessage.key.remoteJid;

        // 4. Apaga a mensagem imediatamente
        await deleteMessage({
          remoteJid,
          fromMe: fullMessage.key.fromMe,
          id: fullMessage.key.id,
          participant: infrator,
        });

        // 5. Envia o aviso oficial conforme solicitado
        const textoAviso = `⚠️ *AVISO DO SISTEMA* ⚠️\n\n` +
          `Mensagem do usuário @${infrator.split('@')[0]} removida por conter conteudo ofensivo, de violação as diretrizes do grupo ou de alusao a ideologias sensiveis.`;

        await socket.sendMessage(remoteJid, { 
          text: textoAviso, 
          mentions: [infrator] 
        });

      } catch (error) {
        console.error("Erro ao tentar apagar mensagem automática ou enviar aviso:", error);
      }
    }
  },
};