import { GoogleGenerativeAI } from "@google/generative-ai";

// Sua chave oficial configurada
const API_KEY = "AIzaSyDxckRqg3iqyyn6yUEw5pwWFWERmi6caPg"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export default {
  name: "ia",
  description: "A inteligência oficial da Julinha.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    if (!pergunta) return await socket.sendMessage(remoteJid, { text: "❓ Fala aí, o que você quer saber?" });

    try {
      // AJUSTE AQUI: Usando o nome completo do modelo para evitar o erro 404
      const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
      
      const prompt = `Você é a Julinha v1, uma IA sarcástica e inteligente do grupo de WhatsApp 'Manicômio'. 
      O dono do bot é o Jadsön (Biscoitinho Play). 
      Responda de forma direta e debochada.
      
      Pergunta do usuário: ${pergunta}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      await socket.sendMessage(remoteJid, { 
        text: `🤖 *JULINHA INTEL:* \n\n${text}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("Erro no Gemini:", e);
      
      // Caso o 1.5 Flash ainda dê erro, o bot tenta o Pro automaticamente
      try {
          const modelFallback = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
          const res = await modelFallback.generateContent(pergunta);
          await socket.sendMessage(remoteJid, { text: `🤖 *JULINHA:* \n\n${res.response.text()}` });
      } catch (err) {
          await socket.sendMessage(remoteJid, { text: "❌ Erro 404: Modelo não encontrado. Verifique se a chave tem acesso ao Gemini Pro." });
      }
    }
  }
};