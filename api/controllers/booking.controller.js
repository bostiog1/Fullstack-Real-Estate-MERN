
import prisma from "../lib/prisma.js";

// Endpoint to create a new booking
export const createBooking = async (req, res) => {
  const { checkInDate, checkOutDate, postId } = req.body;
  const userId = req.userId;

  if (!checkInDate || !checkOutDate || !postId) {
    return res.status(400).json({
      message:
        "Invalid booking data. Missing checkInDate, checkOutDate, or postId.",
    });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkOut <= checkIn) {
    return res.status(400).json({
      message: "Check-out date must be after check-in date.",
    });
  }

  // Verifică dacă check-in este în trecut
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkIn < today) {
    return res.status(400).json({
      message: "Cannot book dates in the past.",
    });
  }

  try {
    // 1. Verify if the post exists and is rentable
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (!post.isRentable) {
      return res.status(400).json({
        message: "This property is not available for rent.",
      });
    }

    // Verifică ca userul să nu-și rezerve propria proprietate
    if (post.userId === userId) {
      return res.status(400).json({
        message: "You cannot book your own property.",
      });
    }

    // 2. Check for overlapping bookings - logică îmbunătățită
    const existingBookings = await prisma.booking.findMany({
      where: {
        postId: postId,
        OR: [
          {
            // Rezervarea nouă începe în timpul unei rezervări existente
            AND: [
              { checkInDate: { lte: checkIn } },
              { checkOutDate: { gt: checkIn } },
            ],
          },
          {
            // Rezervarea nouă se termină în timpul unei rezervări existente
            AND: [
              { checkInDate: { lt: checkOut } },
              { checkOutDate: { gte: checkOut } },
            ],
          },
          {
            // Rezervarea nouă înconjoară o rezervare existentă
            AND: [
              { checkInDate: { gte: checkIn } },
              { checkOutDate: { lte: checkOut } },
            ],
          },
        ],
      },
    });

    if (existingBookings.length > 0) {
      return res.status(409).json({
        message:
          "This property is not available for the selected dates. Please check the calendar for availability.",
        conflictingBookings: existingBookings.map((booking) => ({
          checkIn: booking.checkInDate,
          checkOut: booking.checkOutDate,
        })),
      });
    }

    // 3. Calculate total price
    const oneDay = 24 * 60 * 60 * 1000;
    const bookingDurationInDays = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / oneDay
    );
    const totalCalculatedPrice = bookingDurationInDays * post.price;

    // 4. Create the new booking
    const newBooking = await prisma.booking.create({
      data: {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: totalCalculatedPrice,
        userId: userId,
        postId: postId,
      },
      include: {
        post: {
          select: {
            title: true,
            address: true,
            images: true,
            price: true,
          },
        },
      },
    });

    res.status(201).json({
      ...newBooking,
      message: "Booking created successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create booking." });
  }
};

// Endpoint to get all booked dates for a specific post
export const getBookedDates = async (req, res) => {
  const { postId } = req.params;

  try {
    const bookedDates = await prisma.booking.findMany({
      where: {
        postId: postId,
      },
      select: {
        checkInDate: true,
        checkOutDate: true,
      },
    });

    res.status(200).json(bookedDates);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get booked dates." });
  }
};

// Endpoint to get all bookings for a logged-in user
export const getUserBookings = async (req, res) => {
  const userId = req.userId;

  try {
    const userBookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        post: {
          select: {
            title: true,
            address: true,
            images: true,
            price: true,
            id: true,
            user: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(userBookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user bookings." });
  }
};

// NOUĂ: Endpoint pentru obținerea rezervărilor unei proprietăți (pentru proprietar)
export const getPostBookings = async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  try {
    // Verifică dacă userul este proprietarul postului
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.userId !== userId) {
      return res.status(403).json({
        message: "You can only view bookings for your own properties.",
      });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        postId: postId,
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
            email: true,
          },
        },
      },
      orderBy: {
        checkInDate: "asc",
      },
    });

    res.status(200).json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post bookings." });
  }
};

// NOUĂ: Endpoint pentru anularea unei rezervări
export const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.userId;

  try {
    // Găsește rezervarea
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        post: {
          select: {
            userId: true,
            title: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Verifică dacă userul poate anula rezervarea
    // (proprietarul postului sau cel care a făcut rezervarea)
    const canCancel =
      booking.userId === userId || booking.post.userId === userId;

    if (!canCancel) {
      return res.status(403).json({
        message: "You don't have permission to cancel this booking.",
      });
    }

    // Verifică dacă rezervarea poate fi anulată (nu a început deja)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (booking.checkInDate <= today) {
      return res.status(400).json({
        message:
          "Cannot cancel bookings that have already started or are starting today.",
      });
    }

    // Șterge rezervarea
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    res.status(200).json({
      message: "Booking cancelled successfully.",
      cancelledBooking: {
        id: booking.id,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        postTitle: booking.post.title,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to cancel booking." });
  }
};

// NOUĂ: Endpoint pentru a verifica disponibilitatea unor date specifice
export const checkAvailability = async (req, res) => {
  const { postId } = req.params;
  const { checkInDate, checkOutDate } = req.query;

  if (!checkInDate || !checkOutDate) {
    return res.status(400).json({
      message: "Please provide both checkInDate and checkOutDate.",
    });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  try {
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        postId: postId,
        OR: [
          {
            AND: [
              { checkInDate: { lte: checkIn } },
              { checkOutDate: { gt: checkIn } },
            ],
          },
          {
            AND: [
              { checkInDate: { lt: checkOut } },
              { checkOutDate: { gte: checkOut } },
            ],
          },
          {
            AND: [
              { checkInDate: { gte: checkIn } },
              { checkOutDate: { lte: checkOut } },
            ],
          },
        ],
      },
    });

    const isAvailable = conflictingBookings.length === 0;

    res.status(200).json({
      available: isAvailable,
      conflictingBookings: conflictingBookings.map((booking) => ({
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
      })),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to check availability." });
  }
};
