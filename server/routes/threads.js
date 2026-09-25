const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();

router.get("/threads", async (req, res) => {
  const { search, sort } = req.query;

  const page = Number(req.query.page) || 1;
  const pageSize = 10;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where = search
    ? {
        title: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};

  const orderBy = {
    createdAt: sort === "oldest" ? "asc" : "desc",
  };

  const [threads, total] = await Promise.all([
    prisma.thread.findMany({
      where,
      orderBy,
      skip,
      take,
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
    }),

    prisma.thread.count({
      where,
    }),
  ]);

  const hasMore = total > page * pageSize;

  res.json({
    threads,
    total,
    hasMore,
  });
});

module.exports = router;