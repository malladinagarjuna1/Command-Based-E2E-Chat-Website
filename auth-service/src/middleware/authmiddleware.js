import jwt from "jsonwebtoken";
 import {PrismaClient} from "@prisma/client";
 const prisma = new PrismaClient();



// export const protect = async (req, res, next) => {
//   try {

//     const authHeader = req.headers.authorization || req.headers.Authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Not authorized, token missing" });
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Not authorized" });


//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

  
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true
//       }
//     });

//     if (!user) return res.status(401).json({ message: "User not found" });

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("auth middleware error:", err);
//     return res.status(401).json({ message: "Not authorized", error: err.message });
//   }
// };

export const protect = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

   
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; 
    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    return res.status(401).json({ message: "Not authorized", error: err.message });
  }
};