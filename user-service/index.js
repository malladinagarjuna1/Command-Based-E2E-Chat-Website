import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userroutes.js";
dotenv.config();
const PORT = process.env.PORT || 4002;

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => res.send("User service OK"));


app.use("/api/users", userRoutes);


app.use((_, res) => res.status(404).json({ message: "Not found" }));

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
