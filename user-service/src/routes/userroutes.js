import express from "express";
import {
  getMe,
 
  addContact,
  getContacts,
  removeContact,
  blockUser,
  unblockUser
} from "../controllers/usercontroller.js";

import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.get("/me", protect, getMe);


router.post("/contacts", protect, addContact);
router.get("/contacts",protect, getContacts);
router.delete("/contacts/:id", protect, removeContact);

router.post("/block/:targetId", protect, blockUser);
router.delete("/block/:targetId",protect, unblockUser);

export default router;
