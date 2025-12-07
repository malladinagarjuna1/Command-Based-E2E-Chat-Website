import bcrypt from "bcryptjs";
import  {generateToken } from "../utils/generatetoken.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


let users= [];

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.json({
    message: "User created",
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });
  
  const token = generateToken(user.id);

  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
};
