
app.get("/api/threads", async (req, res, next) => {
  try {
    // Step 1: Read search and sort from the URL
    const { search, sort } = req.query;

    // Step 2: Build the search condition
    const where = search
      ? {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

    // Step 3: Build the sorting condition
    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" }
        : { createdAt: "desc" };

    // Step 4: Ask Prisma to filter and sort
    const threads = await prisma.thread.findMany({
      where,
      orderBy,
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

    // Step 5: Send the result
    res.json({ threads });
  } catch (error) {
    next(error);
  }
});