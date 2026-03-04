import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoute.js";
import citizenRoutes from "./src/routes/citizenRoute.js";
import adminRoutes from "./src/routes/adminRoute.js";
import officeRoute from "./src/routes/officeRoute.js";



connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/citizen", citizenRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/offices",officeRoute);


app.get("/", (req, res) => {
  res.send("eSeva backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);


