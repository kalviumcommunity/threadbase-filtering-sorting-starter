import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

// ─────────────────────────────────────────────────────────────
// GET /api/threads?search=<term>&sort=<newest|oldest>
//
// ⚠️  THIS IS THE STARTER (BROKEN) VERSION.
// It reads req.query correctly, but it filters and sorts an
// IN-MEMORY ARRAY with JavaScript after loading every row.
// Your job: replace the array logic with a real Prisma
// `where` + `orderBy` so the DATABASE does the filtering.
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const { search, sort } = req.query;

    // Loads EVERY thread into memory, every request. 🚫
    const where = search ? {title: {contains: search, mode: "insensitive"}} : {};

    // TODO: remove this in-memory filter — build a Prisma `where` instead.

    // TODO: remove this in-memory sort — build a Prisma `orderBy` instead.
    const orderBy = sort === "oldest" ? {createdAt: "asc"} : {createdAt: "desc"};

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
