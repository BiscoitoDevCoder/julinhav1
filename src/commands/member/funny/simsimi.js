import axios from 'axios';

export default {
  name: "ia",
  description: "A inteligência suprema da Julinha.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    if (!pergunta) return await socket.sendMessage(remoteJid, { text: "❓ O que você quer saber? Ex: !ia quem é o maior de Cariacica?" });

    try {
      // Usando a Hercai (v3) - Atualmente a mais estável para bots
      const response = await axios.get(`https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(pergunta)}`);
      
      const resposta = response.data.reply;

      if (!resposta) throw new Error("Resposta vazia");

      await socket.sendMessage(remoteJid, { 
        text: `🤖 *JULINHA INTEL:* \n\n${resposta}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("Erro na IA:", e.message);
      
      // Se a Hercai falhar, tenta essa outra aqui como plano B
      try {
         const fallback = await axios.get(`https://api.vyturex.com/gemini?prompt=${encodeURIComponent(pergunta)}`);
         await socket.sendMessage(remoteJid, { 
            text: `🤖 *JULINHA (Backup):* \n\n${fallback.data.result}` 
         }, { quoted: webMessage });
      } catch (err) {
         await socket.sendMessage(remoteJid, { text: "❌ Minhas redes neurais estão offline. O Manicômio fritou meu cérebro!" });
      }
    }
  }
};