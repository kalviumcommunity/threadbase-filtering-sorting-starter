import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

// ─────────────────────────────────────────────────────────────
// GET /api/threads?search=<term>&sort=<newest|oldest>
//
// Filtering and sorting are done by PostgreSQL via Prisma
// (`where` + `orderBy`) — no in-memory .filter()/.sort().
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const { search, sort } = req.query;

    // Case-insensitive title search, executed by the database (ILIKE).
    const where = search
      ? {
          title: {
            contains: String(search),
            mode: "insensitive",
          },
        }
      : {};

    // oldest → createdAt asc; newest (or no sort) → createdAt desc.
    const orderBy = { createdAt: sort === "oldest" ? "asc" : "desc" };

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
