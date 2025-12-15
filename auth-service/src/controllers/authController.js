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
console.log(email);
console.log(password);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  console.log(user);
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });
console.log(valid);
  const token = generateToken(user.id);
console.log(token);
  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
};

export const  getProfile = async (req,res)=>{
  try {
    if(!req.user)return res.status(404).json({message:"User not found"});
    return res.json({user: req.user});

  }catch(err){
    console.error("getProfilerror:", err);
    return  res.status(500).json({message:"Server error", error: err.message });

  }
};
