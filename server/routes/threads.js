import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

// GET /api/threads?search=<term>&sort=<newest|oldest>
router.get("/", async (req, res, next) => {
  try {
    const { search, sort } = req.query;

    // Build the Prisma where clause
    const where = search
      ? {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

    // Build the Prisma orderBy clause
    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" }
        : { createdAt: "desc" };

    // Database handles filtering and sorting
    const threads = await prisma.thread.findMany({
      where,
      orderBy,
      include: {
        author: { select: { name: true, avatarUrl: true } },
        _count: { select: { comments: true } },
      },
    });

    res.json({ threads });
  } catch (error) {
    next(error);
  }
});

export default router;