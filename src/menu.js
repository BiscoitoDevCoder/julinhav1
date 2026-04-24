export function menuMessage(groupJid) {
  const prefix = getPrefix(groupJid);
  const v = pkg.version;
  
  // Método de Força Bruta: Caractere invisível + muitas quebras de linha
  const readMore = String.fromCharCode(8206).repeat(4001);

  return `〔 **${BOT_NAME.toUpperCase()}** 〕
${readMore}
  ◈ **STATUS DO SISTEMA** ◈
  ⦿ **Versão:** ${v}
  ⦿ **Prefixo:** ${prefix}
  ⦿ **Data:** ${new Date().toLocaleDateString("pt-br")}

  ---

  「 **👑 CONTROLE DONO** 」
  ❯ ${prefix}on • ${prefix}off
  ❯ ${prefix}setprefix • ${prefix}exec
  ❯ ${prefix}setmenu • ${prefix}proxy

  「 **🛡️ ADMINISTRAÇÃO** 」
  ❯ ${prefix}ban • ${prefix}kick • ${prefix}hidetag
  ❯ ${prefix}abrir • ${prefix}fechar • ${prefix}link
  ❯ ${prefix}mute • ${prefix}unmute • ${prefix}limpar
  ❯ ${prefix}promover • ${prefix}rebaixar • ${prefix}revelar

  「 **🎭 MANICÔMIO** 」
  ❯ ${prefix}cirurgia 🩺
  ❯ ${prefix}amorodio ⚖️
  ❯ ${prefix}topex 🤡
  ❯ ${prefix}abracar • ${prefix}beijar • ${prefix}matar
  ❯ ${prefix}socar • ${prefix}lutar • ${prefix}jantar

  「 **🛠️ UTILITÁRIOS** 」
  ❯ ${prefix}sticker • ${prefix}ttp • ${prefix}attp • ${prefix}brat
  ❯ ${prefix}toimage • ${prefix}togif • ${prefix}tomp3 • ${prefix}tomp4
  ❯ ${prefix}ping • ${prefix}info • ${prefix}perfil

  「 **📡 REDES & IA** 」
  ❯ ${prefix}play • ${prefix}tiktok • ${prefix}ig • ${prefix}fb
  ❯ ${prefix}gemini • ${prefix}gpt • ${prefix}flux • ${prefix}iasticker

  「 **🎨 LABORATÓRIO CANVAS** 」
  ❯ ${prefix}blur • ${prefix}rip • ${prefix}pixel • ${prefix}gray
  ❯ ${prefix}cadeia • ${prefix}espelhar • ${prefix}inverter

  ---
  _Julinha v1 - Interface Interativa_`;
}
