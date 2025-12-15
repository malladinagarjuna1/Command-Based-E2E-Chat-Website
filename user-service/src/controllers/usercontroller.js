import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get current authenticated user identity
 * Auth-service already validated JWT
 */
export const getMe = async (req, res) => {
  return res.json({
    userId: req.user.id
  });

};

/**
 * Add contact
 * body: { contactId, alias }
 */
export const addContact = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { contactId, alias } = req.body;

    if (!contactId) {
      return res.status(400).json({ message: "contactId is required" });
    }

    const contact = await prisma.contact.create({
      data: {
        ownerId,
        contactId,
        alias: alias || null
      }
    });

    return res.status(201).json({
      message: "Contact added",
      contact
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Add contact failed" });
  }
};

/**
 * Get contacts of authenticated user
 */
export const getContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ contacts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Get contacts failed" });
  }
};

/**
 * Remove contact
 */
export const removeContact = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    const contact = await prisma.contact.findUnique({ where: { id } });

    if (!contact || contact.ownerId !== ownerId) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await prisma.contact.delete({ where: { id } });

    return res.json({ message: "Contact removed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Remove failed" });
  }
};

/**
 * Block a user
 */
export const blockUser = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { targetId } = req.params;

    if (!targetId) {
      return res.status(400).json({ message: "targetId required" });
    }

    const exists = await prisma.blocked.findFirst({
      where: { ownerId, blockedId: targetId }
    });

    if (exists) {
      return res.json({ message: "Already blocked" });
    }

    const blocked = await prisma.blocked.create({
      data: { ownerId, blockedId: targetId }
    });

    return res.json({ message: "User blocked", blocked });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Block failed" });
  }
};

/**
 * Unblock a user
 */
export const unblockUser = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { targetId } = req.params;

    const row = await prisma.blocked.findFirst({
      where: { ownerId, blockedId: targetId }
    });

    if (!row) {
      return res.status(404).json({ message: "Not blocked" });
    }

    await prisma.blocked.delete({ where: { id: row.id } });

    return res.json({ message: "User unblocked" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unblock failed" });
  }
};
