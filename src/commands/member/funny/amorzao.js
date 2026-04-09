import { PREFIX } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "assumir",
  description: "Assume seu amor por alguém que você marcar!",
  commands: ["assumir", "declarar"],
  usage: `${PREFIX}assumir @usuario`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendReply,
    userLid,
    args,
    remoteJid,
    isReply,
    replyLid,
  }) => {
    // 1. Validação de Grupo
    if (!remoteJid || !remoteJid.endsWith('@g.us')) {
      return await sendReply("As declarações devem ser feitas em público (no grupo)! ❤️");
    }

    // 2. Identifica quem foi marcado ou respondido
    let targetLid = isReply ? replyLid : args[0] ? `${onlyNumbers(args[0])}@lid` : null;

    if (!targetLid) {
      return await sendReply(`Esqueceu de marcar o seu amor! 😅\nUse: ${PREFIX}assumir @usuario`);
    }

    if (targetLid === userLid) {
      return await sendReply("O amor próprio é importante, mas o comando é para se declarar para outra pessoa! 😂");
    }

    const userNumber = userLid.split('@')[0];
    const targetNumber = targetLid.split('@')[0];

    try {
      // 3. LISTA DE FRASES ROMÂNTICAS (Sorteio aleatório)
const frasesAmor = [
  // --- Estilo Romântico Clássico ---
  `❤️ *DECLARAÇÃO PÚBLICA* ❤️\n\n@${userNumber} tomou coragem e assumiu: "Eu sou completamente apaixonado(a) por @${targetNumber}!". Que momento lindo! 💘✨`,
  `🌹 *O AMOR VENCEU* 🌹\n\n@${userNumber} não consegue mais esconder. O coração dele(a) bate mais forte toda vez que @${targetNumber} aparece! 😏🔥`,
  `💍 *COMPROMISSO* 💍\n\n@${userNumber} assumiu para o grupo: @${targetNumber} é a pessoa que faz os dias dele(a) mais felizes! 🎊🥂`,
  `💌 *CONFISSÃO REAL* 💌\n\n@${userNumber} mandou avisar: @${targetNumber}, você é o meu mundo e eu te amo de verdade! 🙈💖`,
  `✨ *SENTIMENTO EXPOSTO* ✨\n\n@${userNumber} parou tudo para dizer: "@${targetNumber}, meu coração é seu!". O amor é maravilhoso! 😍🌈`,
  `💕 *SÓ DÁ VOCÊ* 💕\n\n@${userNumber} confessou que não para de pensar em @${targetNumber} desde que se conheceram. É o amor! 💓`,
  `🌟 *ALMAS GÊMEAS?* 🌟\n\n@${userNumber} acredita que @${targetNumber} é sua metade da laranja. Alguém traz o açúcar! 🍊🍭`,
  `🎵 *TRILHA SONORA* 🎵\n\n@${userNumber} disse que toda música romântica agora faz lembrar de @${targetNumber}. Que fofura! 🎧💘`,
  `🔥 *CHAMA ACESA* 🔥\n\n@${userNumber} admitiu que @${targetNumber} é a única pessoa que faz sua temperatura subir! 🥵🌡️`,
  `👑 *MEU REINO POR VOCÊ* 👑\n\n@${userNumber} declarou que @${targetNumber} é a realeza do seu coração. Vida longa ao casal! 🏰💎`,

  // --- Estilo Divertido/Zoeira ---
  `😏 *NA SURDINA* 😏\n\n@${userNumber} assumiu que finge que não liga, mas morre de ciúmes de @${targetNumber}! 👀💢`,
  `🍔 *MAIS QUE LANCHE* 🍔\n\n@${userNumber} disse que ama @${targetNumber} mais do que um combo de hambúrguer com batata frita! Isso é sério! 🍟🥤`,
  `🏹 *CUPIDO LOUCO* 🏹\n\nO cupido acertou @${userNumber} em cheio e o alvo foi @${targetNumber}. Preparem o enxoval! 👶🍼`,
  `😂 *PERDEU A POSTURA* 😂\n\n@${userNumber} sempre disse que era "gelo", mas derreteu todinho por @${targetNumber}! 🧊🔥`,
  `📣 *ALÔ MÃE!* 📣\n\n@${userNumber} já quer levar @${targetNumber} para conhecer os sogros no próximo domingo! 🚗🏡`,
  `🤡 *PALHAÇO APAIXONADO* 🤡\n\n@${userNumber} admitiu: "Fico bobo(a) toda vez que @${targetNumber} me manda um oi". O amor é cego mesmo! 🤡💖`,
  `💰 *VALE OURO* 💰\n\n@${userNumber} disse que se @${targetNumber} fosse um boleto, ele(a) pagaria até com juros só pra ter por perto! 💸📉`,
  `🚀 *PARA O INFINITO* 🚀\n\nO amor de @${userNumber} por @${targetNumber} é maior que o delay desse grupo! 🛸🌌`,
  `🚑 *CHAMA O SAMU* 🚑\n\n@${userNumber} está passando mal de tanto amor por @${targetNumber}. Alguém traz um desfibrilador! 💓⚡`,
  `🤪 *DOIDINHO(A)* 🤪\n\n@${userNumber} assumiu que já decorou até o horário que @${targetNumber} fica online. Isso é amor ou stalker? 🤔🤣`,

  // --- Estilo Direto e Reto ---
  `💎 *PRECIOSIDADE* 💎\n\n@${userNumber} mandou o papo reto: @${targetNumber} é a pessoa mais incrível desse grupo! 💎✨`,
  `🎯 *NA MOSCA* 🎯\n\n@${userNumber} não quer mais saber de ninguém, seu foco total agora é @${targetNumber}! 🎯❤️`,
  `🔗 *CONECTADOS* 🔗\n\n@${userNumber} e @${targetNumber}... o bot previu que esse Wi-Fi do amor nunca vai cair! 📶💏`,
  `☀️ *MEU SOL* ☀️\n\n@${userNumber} disse que @${targetNumber} ilumina seus dias mais sombrios. Que poético! ☀️🌻`,
  `🌊 *MAREMOTOS* 🌊\n\n@${userNumber} está mergulhado(a) fundo nos olhos de @${targetNumber}! 🌊🏊`,
  `🛑 *PARE TUDO* 🛑\n\n@${userNumber} quer que todos saibam: @${targetNumber}, eu sou seu e você é minha/meu! 🛑🔐`,
  `🔒 *CHAVE DO CORAÇÃO* 🔒\n\n@${userNumber} entregou a chave do seu coração para @${targetNumber} e jogou o cadeado fora! 🗝️🔒`,
  `📈 *EM ALTA* 📈\n\nAs ações de @${targetNumber} no coração de @${userNumber} só fazem subir! 📊🚀`,
  `🛸 *ABDUZIDO(A)* 🛸\n\n@${userNumber} foi levado(a) pelo charme de @${targetNumber} e não quer mais voltar! 🛸👽`,

  // --- Estilo Curto e Impactante ---
  `🖤 *SÓ VOCÊ* 🖤\n\n@${userNumber} + @${targetNumber} = O maior casal que este grupo já viu! 🖤🔥`,
  `🤐 *SEM PALAVRAS* 🤐\n\n@${userNumber} ficou mudo(a) de tanto amor ao ver a foto de @${targetNumber}! 😶💘`,
  `⚡ *CHOQUE TÉRMICO* ⚡\n\n@${userNumber} sentiu um arrepio só de pensar em @${targetNumber}! ⚡🥶`,
  `🍃 *LEVEZA* 🍃\n\nCom @${targetNumber}, @${userNumber} se sente flutuando nas nuvens! ☁️🎈`,
  `🎁 *PRESENTE* 🎁\n\n@${userNumber} disse que @${targetNumber} é o melhor presente que a vida deu! 🎁💝`,
  `🍭 *DOCINHO* 🍭\n\n@${userNumber} admitiu que @${targetNumber} é a pessoa mais doce do mundo! 🍭🍯`,
  `💎 *RARIDADE* 💎\n\n@${userNumber} sabe que @${targetNumber} é uma joia rara e não quer perder! 💎💖`,
  `🕯️ *ILUMINADO* 🕯️\n\n@${targetNumber} é a luz no fim do túnel de @${userNumber}! 🕯️🔦`,
  `🐾 *SEGUIDOR* 🐾\n\n@${userNumber} seguiria @${targetNumber} até o fim do mundo se precisasse! 🌍👣`,
  `🥂 *TIM-TIM* 🥂\n\n@${userNumber} quer brindar o resto da vida ao lado de @${targetNumber}! 🥂🎉`
];

      const amorAleatorio = frasesAmor[Math.floor(Math.random() * frasesAmor.length)];

      // 4. Envia a declaração marcando os dois envolvidos
      await sendReply(amorAleatorio, [userLid, targetLid]);

    } catch (error) {
      console.error("Erro no comando assumir:", error);
      await sendReply("Ocorreu um erro ao processar essa declaração de amor! ⚠️");
    }
  },
};