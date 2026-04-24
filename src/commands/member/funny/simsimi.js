import axios from 'axios';

export default {
  name: "ia",
  description: "A inteligência suprema da Julinha.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    if (!pergunta) return await socket.sendMessage(remoteJid, { text: "❓ O que você quer saber? Ex: !ia como fritar um ovo?" });

    try {
      // Usando uma API de IA gratuita e estável
      const response = await axios.get(`https://podre-api.vercel.app/api/gemini?pergunta=${encodeURIComponent(pergunta)}`);
      
      const resposta = response.data.resultado || response.data.response;

      if (!resposta) throw new Error("Sem resposta");

      // Envia a resposta da IA
      await socket.sendMessage(remoteJid, { 
        text: `🤖 *JULINHA IA:* \n\n${resposta}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error(e);
      await socket.sendMessage(remoteJid, { text: "❌ Meu processador superaqueceu! Tente perguntar de outro jeito." });
    }
  }
};