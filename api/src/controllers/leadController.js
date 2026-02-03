const Lead = require("../models/Lead");
const { sendTelegram } = require("../utils/notifier");

// ============================
// POST /leads  (público)
// ============================
async function createLead(req, res) {
  try {
    const { name, phone, city, systemType, consumption, message } = req.body;

    // validação básica
    if (!name || !phone || !systemType) {
      return res.status(400).json({
        ok: false,
        message: "name, phone e systemType são obrigatórios"
      });
    }

    // validação simples do telefone (aceita 10-13 dígitos)
    const phoneDigits = String(phone).replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      return res.status(400).json({
        ok: false,
        message: "Telefone inválido"
      });
    }

    // cria lead
    const lead = await Lead.create({
      name: String(name).trim(),
      phone: phoneDigits,
      city: String(city || "").trim(),
      systemType: String(systemType || "").trim(),
      consumption: String(consumption || "").trim(),
      message: String(message || "").trim(),
      source: "site",
      status: "novo"
    });

    // ===== TELEGRAM (não pode quebrar a criação) =====
    try {
      const wa = `https://wa.me/55${phoneDigits}`;
      const painel = "https://dcinfinitysolar.com.br/admin/leads";

      const text =
        `<b>📩 Novo Lead - DC Infinity Solar</b>\n` +
        `<b>👤 Nome:</b> ${lead.name}\n` +
        `<b>📞 WhatsApp:</b> ${lead.phone}\n` +
        `<b>🏙 Cidade:</b> ${lead.city || "-"}\n` +
        `<b>⚡ Sistema:</b> ${lead.systemType}\n` +
        `<b>🔋 Consumo:</b> ${lead.consumption || "-"} kWh\n` +
        `<b>🏷 Status:</b> ${lead.status || "novo"}\n` +
        `<b>🌐 Origem:</b> ${lead.source || "site"}\n\n` +
        `<b>➡️ Ações:</b>\n` +
        `• <a href="${wa}">Chamar no WhatsApp</a>\n` +
        `• <a href="${painel}">Abrir painel de leads</a>\n`;

      await sendTelegram(text);
    } catch (e) {
      console.error("Telegram notify error:", e?.message || e);
    }
    // ================================================

    return res.status(201).json({ ok: true, leadId: lead._id });
  } catch (err) {
    console.error("createLead error:", err);
    return res.status(500).json({ ok: false, message: "Erro ao salvar lead" });
  }
}

// ============================
// GET /leads  (protegido por adminAuth)
// ============================
async function listLeads(_req, res) {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    return res.json({ ok: true, leads });
  } catch (err) {
    console.error("listLeads error:", err);
    return res.status(500).json({ ok: false, message: "Erro ao listar leads" });
  }
}

// ============================
// PATCH /leads/:id/status  (protegido por adminAuth)
// ============================
async function updateLeadStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["novo", "em_contato", "fechado"];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "Status inválido. Use: novo, em_contato, fechado"
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ ok: false, message: "Lead não encontrado" });
    }

    return res.json({ ok: true, lead });
  } catch (err) {
    console.error("updateLeadStatus error:", err);
    return res.status(500).json({ ok: false, message: "Erro ao atualizar status" });
  }
}

module.exports = {
  createLead,
  listLeads,
  updateLeadStatus
};

