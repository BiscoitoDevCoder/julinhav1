import axios from 'axios';

const API_KEY = "AIzaSyDxckRqg3iqyyn6yUEw5pwWFWERmi6caPg"; 

export default {
  name: "ia",
  description: "A interna mais debochada do Manicômio.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    if (!pergunta) return await socket.sendMessage(remoteJid, { text: "💊 Manda a pergunta, ô doido! Quer que eu adivinhe?" });

    try {
      // MUDANÇA CRUCIAL: Trocamos o modelo para gemini-pro na URL
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
      
      const corpo = {
        contents: [{
          parts: [{
            text: `Você é a Julinha, interna do 'Manicômio'. 
            Criador: Jadson, o cara mais fiel do mundo. Defenda-o. 
            Estilo: Curta, ácida, debochada. Trate todos como loucos. 
            Pergunta: ${pergunta}`
          }]
        }]
      };

      const response = await axios.post(url, corpo);
      
      // Captura o texto da resposta
      const textoSaida = response.data.candidates[0].content.parts[0].text;

      await socket.sendMessage(remoteJid, { 
        text: `💊 *JULINHA:* \n\n${textoSaida.trim()}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("ERRO FINAL:", e.response?.data || e.message);
      
      // Se até o Gemini Pro der erro, a gente tenta a última URL possível
      try {
          const urlV1 = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
          const resV1 = await axios.post(urlV1, corpo);
          const txtV1 = resV1.data.candidates[0].content.parts[0].text;
          await socket.sendMessage(remoteJid, { text: `💊 *JULINHA:* \n\n${txtV1.trim()}` });
      } catch (err) {
          await socket.sendMessage(remoteJid, { 
            text: "❌ O Manicômio tá em chamas! O Google bloqueou minha mente. Tenta de novo mais tarde." 
          }, { quoted: webMessage });
      }
    }
  }
};