const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cors = require("cors");

// Routers
const authRouter = require("./routes/authRoutes");
const roomRouter = require("./routes/roomRoutes");

// Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://zar-portfolio.tech",
    "https://www.zar-portfolio.tech",
    "https://royal-view-hotel.vercel.app",
    "https://royal-view-hotel-admin.vercel.app",
    "https://rvh-frontend.vercel.app/",
    "https://rvh-admin.vercel.app/",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/user", authRouter);
app.use("/api/room", roomRouter);
app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});
// Middleware
// Middlewares
app.use(notFound);
app.use(errorHandler);

dbConnect();
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
