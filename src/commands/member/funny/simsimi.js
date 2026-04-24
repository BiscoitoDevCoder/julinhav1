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
      // Usando o modelo 1.5 Flash (mais rápido e econômico)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Instrução de personalidade para ela saber quem é
      const prompt = `Você é a Julinha v1, uma IA sarcástica, inteligente e um pouco debochada que vive no grupo de WhatsApp chamado 'Manicômio'. 
      O dono do bot é o Jadsön (também conhecido como O Mais fiel da terra). 
      Responda de forma direta, usando gírias brasileiras se necessário.
      
      Pergunta do usuário: ${pergunta}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Envia a resposta braba no WhatsApp
      await socket.sendMessage(remoteJid, { 
        text: `🤖 *JULINHA INTEL:* \n\n${text}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("Erro no Gemini Oficial:", e);
      
      // Se der erro de segurança/limite
      if (e.message.includes("SAFETY")) {
          return await socket.sendMessage(remoteJid, { text: "🚫 Essa pergunta é pesada demais até pra mim. Muda o disco!" });
      }
      
      await socket.sendMessage(remoteJid, { text: "❌ Meu cérebro oficial deu um curto. Tenta de novo em alguns segundos!" });
    }
  }
};