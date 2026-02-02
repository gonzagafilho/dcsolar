const express = require("express");
const router = express.Router();

const { createLead, listLeads } = require("../controllers/leadController");
const { saveChatMessage, listChatBySession } = require("../controllers/chatController");

const adminAuth = require("../middlewares/adminAuth");

// health
router.get("/health", (_req, res) => res.json({ ok: true, service: "dcsolar-api" }));

// leads
router.post("/leads", createLead);
router.get("/leads", adminAuth, listLeads);

// chat
router.post("/chat/messages", saveChatMessage);
router.get("/chat/:sessionId", listChatBySession);

module.exports = router;
