
import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

// GET /api/threads?search=<term>&sort=<newest|oldest>
router.get("/", async (req, res, next) => {
  try {
    const { search, sort } = req.query;

    const threads = await prisma.thread.findMany({
      // Filter in the database
      where: search
        ? {
            title: {
              contains: String(search),
              mode: "insensitive",
            },
          }
        : undefined,

      // Sort in the database
      orderBy: {
        createdAt: sort === "oldest" ? "asc" : "desc",
      },

      // Get related data
      include: {
        author: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    res.json({ threads });
  } catch (error) {
    next(error);
  }
});

export default router;

