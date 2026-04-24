import { GoogleGenerativeAI } from "@google/generative-ai";

// Sua chave mestre
const API_KEY = "AIzaSyDxckRqg3iqyyn6yUEw5pwWFWERmi6caPg"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export default {
  name: "ia",
  description: "A interna mais debochada do Manicômio.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    
    if (!pergunta) {
        return await socket.sendMessage(remoteJid, { 
            text: "💊 Tá gastando minha bateria pra quê? Manda a pergunta ou te mando pra solitária!" 
        }, { quoted: webMessage });
    }

    try {
      // Forçamos o modelo sem firula de versão beta no nome
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Você é a Julinha, a escrava oficial do grupo 'Manicômio'. 
      Seu Pai é o Jadson , o cara mais fiel da terra. 
      CONTEXTO: Você vive em um hospício. 
      PERSONALIDADE: Curta, inteligente e com MUITO DEBOCHE. 
      INSTRUÇÃO: Trate os outros usuários como internos. Não tenha paciência. Seja sarcástica.
      
      Pergunta do louco: ${pergunta}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      await socket.sendMessage(remoteJid, { 
        text: `💊 *JULINHA:* \n\n${text.trim()}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("Surto no Gemini:", e.message);
      
      // Plano B caso o Google tente nos dar alta antes da hora
      try {
          const fallback = genAI.getGenerativeModel({ model: "gemini-pro" });
          const res = await fallback.generateContent(pergunta);
          await socket.sendMessage(remoteJid, { text: `💊 *JULINHA (Dopada):* \n\n${res.response.text()}` });
      } catch (err) {
          await socket.sendMessage(remoteJid, { text: "❌ Tive uma convulsão aqui. Me dá 1 minuto que o remédio ainda não bateu!" });
      }
    }
  }
};