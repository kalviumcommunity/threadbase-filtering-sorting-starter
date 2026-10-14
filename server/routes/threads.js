import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

// GET /api/threads?search=<term>&sort=<newest|oldest>
router.get("/", async (req, res, next) => {
  try {
    const { search, sort } = req.query;

    // Filter in the database
    const where = search
      ? {
          title: {
            contains: String(search),
            mode: "insensitive",
          },
        }
      : {};

    // Sort in the database
    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" }
        : { createdAt: "desc" };

    // Fetch filtered and sorted threads
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