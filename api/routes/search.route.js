// routes/search.route.js
import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const {
    type,
    city,
    property,
    minPrice,
    maxPrice,
    bedroom,
    bathroom,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    // Construiește filtrul pentru căutare
    const where = {};

    // Filtrare după tip (cumpara/inchiriaza)
    if (type && type !== "") {
      where.type = type;
    }

    // Filtrare după oraș (case insensitive și cu suport pentru diacritice)
    if (city && city !== "") {
      where.OR = [
        {
          city: {
            contains: city,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: city,
            mode: "insensitive",
          },
        },
      ];
    }

    // Filtrare după tip proprietate
    if (property && property !== "") {
      where.property = property;
    }

    // Filtrare după preț
    if (minPrice && minPrice !== "" && !isNaN(minPrice)) {
      where.price = {
        ...where.price,
        gte: parseInt(minPrice),
      };
    }

    if (maxPrice && maxPrice !== "" && !isNaN(maxPrice)) {
      where.price = {
        ...where.price,
        lte: parseInt(maxPrice),
      };
    }

    // Filtrare după numărul de dormitoare
    if (bedroom && bedroom !== "" && !isNaN(bedroom)) {
      where.bedroom = {
        gte: parseInt(bedroom),
      };
    }

    // Filtrare după numărul de băi
    if (bathroom && bathroom !== "" && !isNaN(bathroom)) {
      where.bathroom = {
        gte: parseInt(bathroom),
      };
    }

    // Calculează offset pentru paginare
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execută query-ul cu filtrele aplicate
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
              email: true,
            },
          },
          postDetail: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: parseInt(limit),
      }),
      prisma.post.count({ where }),
    ]);

    // Calculează informații despre paginare
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      message: "Eroare la căutarea proprietăților",
      error: error.message,
    });
  }
});

export default router;
