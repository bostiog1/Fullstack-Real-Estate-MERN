import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import axios from "axios";

// Funcție pentru normalizarea textului (elimină diacriticele)
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimină diacriticele
    .replace(/ă/g, "a")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/ș/g, "s")
    .replace(/ț/g, "t");
};

export const getPosts = async (req, res) => {
  const query = req.query;

  // DEBUG: Afișează ce primește din query
  console.log("=== DEBUGGING SEARCH ===");
  console.log("Query params received:", query);

  try {
    // Pentru căutare cu diacritice, căutăm în mai multe moduri
    let whereConditions = [];

    // Filtrare după oraș
    if (query.city && query.city !== "") {
      const searchCity = query.city.trim();
      const normalizedSearchCity = normalizeText(searchCity);

      console.log("Original search city:", searchCity);
      console.log("Normalized search city:", normalizedSearchCity);

      // Mai întâi încearcă să găsească toate posturile pentru a vedea cum sunt salvate
      const allPosts = await prisma.post.findMany({
        select: { city: true, address: true, id: true },
      });

      console.log(
        "All cities in database:",
        allPosts.map((p) => ({
          id: p.id,
          city: p.city,
          normalized: normalizeText(p.city || ""),
        }))
      );

      // Caută folosind multiple strategii:
      // 1. Exact match (case insensitive)
      // 2. Normalized match
      // 3. Contains match pe text normalizat
      whereConditions = allPosts
        .filter((post) => {
          const cityNorm = normalizeText(post.city || "");
          const addressNorm = normalizeText(post.address || "");

          return (
            cityNorm.includes(normalizedSearchCity) ||
            addressNorm.includes(normalizedSearchCity)
          );
        })
        .map((post) => ({ id: post.id }));

      console.log("Matching post IDs:", whereConditions);
    }

    // Dacă avem filtrare după oraș, folosește ID-urile găsite
    const where = {};
    if (whereConditions.length > 0) {
      where.id = {
        in: whereConditions.map((condition) => condition.id),
      };
    } else if (query.city && query.city !== "") {
      // Dacă nu am găsit nimic, returnează rezultat gol
      console.log("No matching cities found");
      return res.status(200).json([]);
    }

    // Adaugă restul filtrelor
    if (query.type && query.type !== "") {
      where.type = query.type;
      console.log("Type filter applied:", query.type);
    }

    if (query.property && query.property !== "") {
      where.property = query.property;
      console.log("Property filter applied:", query.property);
    }

    if (query.bedroom && query.bedroom !== "" && !isNaN(query.bedroom)) {
      where.bedroom = {
        gte: parseInt(query.bedroom),
      };
      console.log("Bedroom filter applied:", parseInt(query.bedroom));
    }

    // if (query.minPrice && query.minPrice !== "" && !isNaN(query.minPrice)) {
    //   where.price = {
    //     ...where.price,
    //     gte: parseInt(query.minPrice),
    //   };
    //   console.log("MinPrice filter applied:", parseInt(query.minPrice));
    // }

    // if (query.maxPrice && query.maxPrice !== "" && !isNaN(query.maxPrice)) {
    //   where.price = {
    //     ...where.price,
    //     lte: parseInt(query.maxPrice),
    //   };
    //   console.log("MaxPrice filter applied:", parseInt(query.maxPrice));
    // }
    if (
      query.minPrice &&
      query.minPrice !== "" &&
      !isNaN(query.minPrice) &&
      parseInt(query.minPrice) > 0
    ) {
      where.price = {
        ...where.price,
        gte: parseInt(query.minPrice),
      };
      console.log("MinPrice filter applied:", parseInt(query.minPrice));
    }

    if (
      query.maxPrice &&
      query.maxPrice !== "" &&
      !isNaN(query.maxPrice) &&
      parseInt(query.maxPrice) > 0
    ) {
      where.price = {
        ...where.price,
        lte: parseInt(query.maxPrice),
      };
      console.log("MaxPrice filter applied:", parseInt(query.maxPrice));
    }

    console.log("Final where clause:", JSON.stringify(where, null, 2));

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        postDetail: {
          select: {
            size: true,
            desc: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Found ${posts.length} posts`);
    console.log(
      "Posts found:",
      posts.map((p) => ({
        id: p.id,
        title: p.title,
        city: p.city,
        address: p.address,
        type: p.type,
        price: p.price,
      }))
    );

    // Transformă datele pentru compatibilitate cu frontend
    const transformedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      price: post.price,
      images: post.images,
      address: post.address,
      city: post.city,
      bedroom: post.bedroom,
      bathroom: post.bathroom,
      latitude: parseFloat(post.latitude),
      longitude: parseFloat(post.longitude),
      type: post.type,
      property: post.property,
      createdAt: post.createdAt,
      isRentable: post.isRentable,
      user: post.user,
      size: post.postDetail?.size,
      description: post.postDetail?.desc?.substring(0, 150) + "..." || "",
    }));

    console.log("=== END DEBUGGING ===");
    res.status(200).json(transformedPosts);
  } catch (err) {
    console.log("ERROR in getPosts:", err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  const token = req.cookies?.token;

  let isSaved = false;
  let post;

  try {
    // Păstrează logica pentru dummy posts (id < 24)
    if (id.length < 24) {
      const { singlePostData, userData } = await import(
        "../../client/src/lib/dummydata.js"
      );

      const dummyPost = {
        ...singlePostData,
        id: id,
        user: {
          username: userData.name,
          avatar: userData.img,
        },
        postDetail: {
          desc: singlePostData.description,
          utilities: "owner",
          pet: "allowed",
          size: singlePostData.size,
        },
        bedroom: singlePostData.bedRooms,
        latitude: singlePostData.latitude.toString(),
        longitude: singlePostData.longitude.toString(),
        isSaved: false,
        isRentable: true,
      };

      return res.status(200).json(dummyPost);
    }

    post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
            email: true, // Pentru contact
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });
        if (saved) {
          isSaved = true;
        }
      } catch (tokenErr) {
        // Token invalid, continuă fără isSaved
        console.log("Invalid token:", tokenErr);
      }
    }

    res.status(200).json({ ...post, isSaved });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const fullAddress = `${body.postData.address}, ${body.postData.city}`;
    let latitude, longitude;

    try {
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          fullAddress
        )}&format=json&limit=1`
      );

      if (geoRes.data && geoRes.data.length > 0) {
        latitude = geoRes.data[0].lat;
        longitude = geoRes.data[0].lon;
      } else {
        return res.status(400).json({ message: "Could not geocode address." });
      }
    } catch (geoErr) {
      console.log(geoErr);
      return res.status(500).json({ message: "Failed to geocode address." });
    }

    const isRentable = body.postData.type === "inchiriaza";

    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        latitude: latitude,
        longitude: longitude,
        userId: tokenUserId,
        isRentable: isRentable,
        postDetail: {
          create: body.postDetail,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        postDetail: true,
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Nu ești autorizat!" });
    }

    // Șterge și rezervările asociate cu postul
    await prisma.$transaction([
      prisma.booking.deleteMany({
        where: { postId: id },
      }),
      prisma.savedPost.deleteMany({
        where: { postId: id },
      }),
      prisma.postDetail.delete({
        where: { postId: id },
      }),
      prisma.post.delete({
        where: { id },
      }),
    ]);

    res.status(200).json({ message: "Anunțul a fost șters cu succes." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Eșec la ștergerea postării!" });
  }
};
