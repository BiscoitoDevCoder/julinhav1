import { GoogleGenerativeAI } from "@google/generative-ai";

// Sua chave (Troque por uma nova assim que puder!)
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
      // Configuração recomendada pelo AI Studio: v1beta para o 1.5-flash
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: "v1beta" } 
      );
      
      const prompt = `Você é a Julinha, a interna mais debochada do grupo 'Manicômio'. 
      Seu criador é o Jadson , o cara mais fiel da terra. 
      Responda de forma CURTA, ÁCIDA e SARCÁSTICA. 
      Lembre-se: você vive em um manicômio. Trate quem pergunta como um louco varrido.
      
      Pergunta do louco: ${pergunta}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      await socket.sendMessage(remoteJid, { 
        text: `💊 *JULINHA:* \n\n${text.trim()}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("Erro no surto da Julinha:", e.message);

      // PLANO DE EMERGÊNCIA: Se o Flash falhar, tenta o Pro (mais estável)
      try {
          const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
          const result = await fallbackModel.generateContent(pergunta);
          const text = result.response.text();
          await socket.sendMessage(remoteJid, { text: `💊 *JULINHA (Dopada):* \n\n${text}` });
      } catch (err) {
          await socket.sendMessage(remoteJid, { 
            text: "❌ Os enfermeiros me pegaram! O sistema tá fora do ar, tenta mais tarde, seu vegetal." 
          });
      }
    }
  }
};