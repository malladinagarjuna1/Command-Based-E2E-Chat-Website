import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authroutes.js";
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());



app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("User Service Running");
});

app.get("/", (req, res) => {
  res.send("User service is running!");
});

app.listen(process.env.PORT, () => {
  console.log(`User service running on port ${process.env.PORT}`)
});

