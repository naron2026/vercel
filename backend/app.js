const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header include health checks and API tools.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("This origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "POS API is running" });
});

const registerCrud = require("./routes/crud.routes");
const productTypeModel = require("./models/producttype.model");
const userModel = require("./models/user.model");
const invoiceModel = require("./models/invoice.model");

app.use("/producttype", registerCrud(productTypeModel));
app.use("/user", registerCrud(userModel));
app.use("/invoice", registerCrud(invoiceModel));

app.use("/", require("./routes/auth.routes"));
app.use("/", require("./routes/dashboard.routes"));
app.use("/", require("./routes/upload.routes"));
app.use("/", require("./routes/sale.routes"));

// This serves local files while developing. Vercel's disk is not persistent,
// so production uploads must be moved to cloud object storage.
app.use("/upload", express.static("./uploads"));

module.exports = app;
