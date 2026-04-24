import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "detector",
  description: "Analisa se uma mensagem ou usuário está mentindo.",
  commands: ["mentira", "verdade", "detector"],
  handle: async ({ socket, remoteJid, userLid, args, isReply, replyLid, webMessage }) => {
    
    // Pega quem está sendo analisado (quem mandou a mensagem ou quem foi respondido)
    const targetLid = isReply ? replyLid : userLid;
    const targetNumber = onlyNumbers(targetLid);
    
    const frasesMentira = [
      "🚨 ALERTA DE PINÓQUIO! Isso é 100% mentira.",
      "🤥 O nariz nem cabe mais na tela. MENTIRA!",
      "📉 Batimentos cardíacos instáveis... O detector confirmou: É FAKE!",
      "🤨 Olhei nos olhos e vi a falsidade. Mentira descarada."
    ];

    const frasesVerdade = [
      "✅ Analisado. Parece que temos um homem de palavra aqui.",
      "💎 Purificado pelo detector! É a mais pura verdade.",
      "⚖️ Batimentos calmos, pupila normal. Veredito: Verdade.",
      "👍 Pode confiar, o detector não mentiu: É real."
    ];

    const isTruth = Math.random() < 0.5;
    const respostaFinal = isTruth 
      ? frasesVerdade[Math.floor(Math.random() * frasesVerdade.length)]
      : frasesMentira[Math.floor(Math.random() * frasesMentira.length)];

    await socket.sendMessage(remoteJid, {
      text: `🔎 *DETECTOR DE VERACIDADE*\n\n👤 *Analisando:* @${targetNumber}\n⚖️ *Resultado:* ${respostaFinal}`,
      mentions: [targetLid]
    }, { quoted: webMessage });
  },
};