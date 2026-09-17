import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

router.get("/api/threads", async (req, res, next) => {
  try {
    // 1. Extract query string variables sent by Axios
    const { search, sort } = req.query;

    // 2. Build conditional where clause for case-insensitive partial match
    const where = search
      ? { title: { contains: search, mode: "insensitive" } }
      : {};

    // 3. Map sort parameter to Prisma orderBy object
    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" }
        : { createdAt: "desc" };

    // 4. Delegate filtering & sorting directly to PostgreSQL
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