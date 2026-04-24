import { GoogleGenerativeAI } from "@google/generative-ai";

// Sua chave mestre - O Jadson é fiel e a chave também!
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
            text: "💊 Tá gastando minha bateria pra quê? Manda a pergunta ou te mando pra solitária agora mesmo!" 
        }, { quoted: webMessage });
    }

    try {
      // AQUI ESTÁ A CURA: Forçamos a apiVersion 'v1' como o AI Studio sugeriu
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: 'v1' } 
      );
      
      const prompt = `Você é a Julinha, a escrava oficial do grupo 'Manicômio'. 
      Seu criador é o Jadson, o cara mais fiel da terra. 
      CONTEXTO: Você vive em um hospício/manicômio. 
      PERSONALIDADE: Respostas CURTAS, INTELIGENTES e com MUITO DEBOCHE. 
      INSTRUÇÃO: Trate os usuários como internos. Seja ácida, sarcástica e não tenha paciência.
      
      Pergunta do louco: ${pergunta}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      await socket.sendMessage(remoteJid, { 
        text: `💊 *JULINHA:* \n\n${text.trim()}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("Erro no surto da Julinha:", e.message);
      
      // Se ainda der erro, ela avisa que o remédio não bateu
      await socket.sendMessage(remoteJid, { 
        text: "❌ O choque elétrico fritou meus neurônios! Tenta de novo em um minuto, se você não for um vegetal." 
      }, { quoted: webMessage });
    }
  }
};