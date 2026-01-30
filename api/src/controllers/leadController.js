const Lead = require("../models/Lead");

function isValidPhone(phone) {
  // validação simples (aceita números, espaços, (), -, +)
  const cleaned = String(phone || "").trim();
  return cleaned.length >= 8;
}

exports.createLead = async (req, res) => {
  try {
    const { name, phone, city, systemType, consumption, message } = req.body || {};

    if (!name || !phone || !systemType) {
      return res.status(400).json({ message: "name, phone e systemType são obrigatórios" });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Telefone inválido" });
    }

    const lead = await Lead.create({
      name,
      phone,
      city: city || "",
      systemType,
      consumption: consumption || "",
      message: message || "",
      source: "site"
    });

    return res.status(201).json({ ok: true, leadId: lead._id });
  } catch (err) {
    console.error("createLead error:", err);
    return res.status(500).json({ message: "Erro ao salvar lead" });
  }
};

exports.listLeads = async (_req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(200);
    return res.json({ ok: true, leads });
  } catch (err) {
    console.error("listLeads error:", err);
    return res.status(500).json({ message: "Erro ao listar leads" });
  }
};
