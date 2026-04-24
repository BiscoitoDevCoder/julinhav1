import translate from 'translate-google-api';

export default {
  name: "simsimi",
  description: "O bot mais debochado da internet.",
  commands: ["simi", "simsimi", "julinha"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const textoUsuario = args.join(" ");
    if (!textoUsuario) return await socket.sendMessage(remoteJid, { text: "❓ Mande algo para eu responder! Ex: !simi oi julinha" });

    try {
      // Usando uma API pública do SimSimi
      const url = `https://api.simsimi.vn/v2/simsimi?text=${encodeURIComponent(textoUsuario)}&lc=pt`;
      
      const response = await fetch(url);
      const data = await response.json();

      let resposta = data.result || "Tô sem paciência agora, pergunta depois.";

      // Envia a resposta debochada
      await socket.sendMessage(remoteJid, { 
        text: `🐥 *SIMSIMI:* ${resposta}` 
      }, { quoted: webMessage });

    } catch (e) {
      await socket.sendMessage(remoteJid, { text: "❌ Minha língua travou, tenta de novo!" });
    }
  }
};