require("dotenv").config();

const path = require("path");
const cors = require("cors");
const express = require("express");
const initDatabase = require("./src/database/init");
const errorHandler = require("./src/middleware/errorHandler");
const registerRoutes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

registerRoutes(app);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(errorHandler);

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Catering system running at http://localhost:${PORT}`);
      console.log("Demo accounts: admin/admin123, staff/staff123, maria/customer123");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
