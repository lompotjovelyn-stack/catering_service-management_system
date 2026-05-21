const sessions = require("./sessions");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const user = sessions.get(token);

  if (!user) {
    return res.status(401).json({ message: "Please log in first." });
  }

  req.user = user;
  req.token = token;
  next();
}

function requireEditor(req, res, next) {
  if (!["admin", "staff"].includes(req.user.role)) {
    return res.status(403).json({ message: "Only admin and staff can add, edit, or delete records." });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can manage accounts." });
  }
  next();
}

module.exports = {
  requireAuth,
  requireEditor,
  requireAdmin,
};
