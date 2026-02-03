async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("Telegram não configurado");
    return;
  }

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await r.json().catch(() => ({}));
    if (!data.ok) {
      console.error("Telegram API respondeu erro:", data);
    }
  } catch (err) {
    console.error("Erro ao enviar Telegram:", err?.message || err);
  }
}

module.exports = { sendTelegram };

