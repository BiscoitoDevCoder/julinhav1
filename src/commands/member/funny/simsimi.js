import axios from 'axios';

export default {
  name: "ia",
  description: "A inteligência suprema da Julinha.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    if (!pergunta) return await socket.sendMessage(remoteJid, { text: "❓ O que você quer saber? Ex: !ia quem é o Biscoitinho Play?" });

    try {
      // Usando uma API de fallback que raramente cai
      const response = await axios.get(`https://api.api-zero.eu.org/api/gemini?pergunta=${encodeURIComponent(pergunta)}`);
      
      const resposta = response.data.resultado || response.data.resposta || response.data.text;

      if (!resposta) throw new Error("API retornou vazio");

      await socket.sendMessage(remoteJid, { 
        text: `🤖 *JULINHA INTEL:* \n\n${resposta}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("Erro na IA:", e.message);
      
      // Segunda tentativa (Caso a primeira falhe)
      try {
         const fallback = await axios.get(`https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(pergunta)}`);
         await socket.sendMessage(remoteJid, { 
            text: `🤖 *JULINHA (Backup):* \n\n${fallback.data.reply}` 
         }, { quoted: webMessage });
      } catch (err) {
         await socket.sendMessage(remoteJid, { text: "❌ Todas as minhas redes neurais falharam. Tente novamente em alguns minutos." });
      }
    }
  }
};