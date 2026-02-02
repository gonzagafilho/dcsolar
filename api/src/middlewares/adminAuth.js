module.exports = function adminAuth(req, res, next) {
  const adminKey = req.headers["x-admin-key"];

  if (!adminKey) {
    return res.status(401).json({
      ok: false,
      message: "Admin key não informada"
    });
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({
      ok: false,
      message: "Admin key inválida"
    });
  }

  next();
};
