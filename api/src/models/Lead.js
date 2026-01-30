const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, default: "", trim: true },
    systemType: {
      type: String,
      enum: ["On-grid", "Off-grid", "Híbrido", "Bombeamento Solar", "Manutenção"],
      required: true
    },
    consumption: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    source: { type: String, default: "site" },
    status: {
      type: String,
      enum: ["novo", "em_atendimento", "fechado"],
      default: "novo"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);
