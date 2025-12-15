import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
 const prisma = new PrismaClient();


export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    // 🔑 Attach ONLY identity
    req.user = {
      id: decoded.id
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({
      message: "Not authorized",
      error: err.message
    });
  }
};
