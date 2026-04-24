import { GoogleGenerativeAI } from "@google/generative-ai";

// Sua chave mestre
const API_KEY = "AIzaSyDxckRqg3iqyyn6yUEw5pwWFWERmi6caPg"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export default {
  name: "ia",
  description: "A inteligência oficial da Julinha.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    if (!pergunta) return await socket.sendMessage(remoteJid, { text: "❓ Vai ficar me olhando ou vai perguntar algo, Jadsön?" });

    try {
      // O segredo: Pegamos o modelo diretamente. 
      // Se o 1.5-flash der erro, o catch vai tratar.
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
      console.error("Erro no Gemini:", e.message);
      
      // Plano B: Se o Flash falhar, tenta o Pro (gemini-1.0-pro)
      try {
          const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
          const res = await fallbackModel.generateContent(pergunta);
          await socket.sendMessage(remoteJid, { text: `🤖 *JULINHA (Backup):* \n\n${res.response.text()}` });
      } catch (err) {
          await socket.sendMessage(remoteJid, { text: "❌ O Google tá me boicotando! Tenta de novo em 1 minuto." });
      }
    }
  }
};