const ChatMessage = require("../models/ChatMessage");

exports.saveChatMessage = async (req, res) => {
  try {
    const { sessionId, role, text } = req.body || {};

    if (!sessionId || !role || !text) {
      return res.status(400).json({ message: "sessionId, role e text são obrigatórios" });
    }

    const msg = await ChatMessage.create({ sessionId, role, text });

    return res.status(201).json({ ok: true, id: msg._id });
  } catch (err) {
    console.error("saveChatMessage error:", err);
    return res.status(500).json({ message: "Erro ao salvar mensagem" });
  }
};

exports.listChatBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const msgs = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).limit(500);
    return res.json({ ok: true, messages: msgs });
  } catch (err) {
    console.error("listChatBySession error:", err);
    return res.status(500).json({ message: "Erro ao buscar mensagens" });
  }
};
