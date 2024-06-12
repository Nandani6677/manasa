const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const session = require("express-session");
const swaggerConfig = require("./swagger/swaggerConfig");
const bodyParser = require("body-parser");
const cron = require("node-cron");
// Connect to MongoDB
const connectDB = require("./config/db");
connectDB();

require("dotenv").config(); // Load environment variables from .env file

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

// Your Express.js code here

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// Configure the session middleware
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

swaggerConfig(app);

// routes
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", schoolRoutes);

// Start the server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
