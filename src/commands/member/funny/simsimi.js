import { GoogleGenerativeAI } from "@google/generative-ai";

// Sua chave braba que você gerou
const API_KEY = "AIzaSyDxckRqg3iqyyn6yUEw5pwWFWERmi6caPg"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export default {
  name: "ia",
  description: "A inteligência oficial da Julinha.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    if (!pergunta) return await socket.sendMessage(remoteJid, { text: "❓ Fala logo o que você quer saber poha!!" });

    try {
      // USANDO O FLASH 1.5 - O REI DA VELOCIDADE
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Você é a Julinha v1, a IA oficial do grupo Manicômio. 
      Seu criador é o cara mais fiel da terra  (Jadson). 
      Seja inteligente, sarcástica e responda de forma direta e muito debochada, parece que viva em um manicomio.
      
      Pergunta: ${pergunta}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      await socket.sendMessage(remoteJid, { 
        text: `🤖 *JULINHA INTEL:* \n\n${text}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("Erro no Gemini 1.5 Flash:", e.message);
      
      if (e.message.includes("404")) {
          await socket.sendMessage(remoteJid, { text: "❌ O Google ainda não liberou o modelo 1.5 Flash para essa chave. Tente em 10 minutos ou use o gemini-pro temporariamente." });
      } else {
          await socket.sendMessage(remoteJid, { text: "❌ Tive um piripaque aqui no 1.5 Flash. Manda de novo!" });
      }
    }
  }
};