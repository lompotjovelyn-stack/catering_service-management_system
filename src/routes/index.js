const authRoutes = require("./authRoutes");
const bookingRoutes = require("./bookingRoutes");
const customerRoutes = require("./customerRoutes");
const healthRoutes = require("./healthRoutes");
const packageRoutes = require("./packageRoutes");
const paymentRoutes = require("./paymentRoutes");
const scheduleRoutes = require("./scheduleRoutes");
const summaryRoutes = require("./summaryRoutes");
const userRoutes = require("./userRoutes");

function registerRoutes(app) {
  app.use("/api", healthRoutes);
  app.use("/api", authRoutes);
  app.use("/api", summaryRoutes);
  app.use("/api", customerRoutes);
  app.use("/api", packageRoutes);
  app.use("/api", bookingRoutes);
  app.use("/api", paymentRoutes);
  app.use("/api", scheduleRoutes);
  app.use("/api", userRoutes);
}

module.exports = registerRoutes;
