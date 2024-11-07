const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://graduation-thesis-chi.vercel.app",
      "https://graduation-thesis-npc822tza-hoanglong1806s-projects.vercel.app",
      "https://graduation-thesis-dkbhxbush-hoanglong1806s-projects.vercel.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define allowed HTTP methods
}));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// config

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// import all routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
// it's for error handling
app.use(ErrorHandler);

module.exports = app;
