import { GoogleGenerativeAI } from "@google/generative-ai";

// Sua chave oficial
const API_KEY = "AIzaSyDxckRqg3iqyyn6yUEw5pwWFWERmi6caPg"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export default {
  name: "ia",
  description: "A inteligência oficial da Julinha.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    if (!pergunta) return await socket.sendMessage(remoteJid, { text: "❓ Fala logo o que você quer saber, Jadson!" });

    try {
      // Aqui está o pulo do gato: usamos o ID do modelo puro
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Você é a Julinha, a IA oficial do grupo Manicômio. 
      Seu criador é o cara mais fiel da terra (Jadson). 
      Responda de forma curta, inteligente e com um toque de deboche MUITO DEBOCHE, voce vive em um Manicomio lembre disso.
      
      Pergunta: ${pergunta}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      await socket.sendMessage(remoteJid, { 
        text: `🤖 *JULINHA INTEL:* \n\n${text}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("Erro detalhado:", e);
      
      // Se der 404 de novo, é porque a sua chave ainda não "ativou" o 1.5 Flash. 
      // Vamos tentar o Pro como última opção antes de desistir.
      try {
          const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
          const res = await modelPro.generateContent(pergunta);
          await socket.sendMessage(remoteJid, { text: `🤖 *JULINHA (Pro):* \n\n${res.response.text()}` });
      } catch (err) {
          await socket.sendMessage(remoteJid, { text: "❌ O Google tá de marcação comigo! Tenta de novo em 2 minutos." });
      }
    }
  }
};