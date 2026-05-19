import { prisma } from "../config/db.js";

/**
 * Toggle favorite (add/remove favorite in booklist item)
 */
const toggleFavorite = async (req, res) => {
  const { bookId } = req.body;

  const bookListItem = await prisma.bookListItem.findUnique({
    where: {
      userId_bookId: {
        userId: req.user.id,
        bookId,
      },
    },
  });

  if (!bookListItem) {
    return res.status(404).json({
      error: "Book is not in your booklist",
    });
  }

  if (bookListItem.userId !== req.user.id) {
    return res.status(403).json({
      error: "Not allowed to modify this item",
    });
  }

  const updated = await prisma.bookListItem.update({
    where: { id: bookListItem.id },
    data: {
      isFavorite: !bookListItem.isFavorite,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      bookListItem: updated,
    },
  });
};

/**
 * Get all favorite books for user
 */
const getFavorites = async (req, res) => {
  const favorites = await prisma.bookListItem.findMany({
    where: {
      userId: req.user.id,
      isFavorite: true,
    },
    include: {
      book: true,
    },
  });

  res.status(200).json({
    status: "success",
    results: favorites.length,
    data: {
      favorites,
    },
  });
};

/**
 * Remove from favorites (explicit version)
 */
const removeFavorite = async (req, res) => {
  const { bookId } = req.body;

  const bookListItem = await prisma.bookListItem.findUnique({
    where: {
      userId_bookId: {
        userId: req.user.id,
        bookId,
      },
    },
  });

  if (!bookListItem) {
    return res.status(404).json({
      error: "Book is not in your booklist",
    });
  }

  if (bookListItem.userId !== req.user.id) {
    return res.status(403).json({
      error: "Not allowed to modify this item",
    });
  }

  const updated = await prisma.bookListItem.update({
    where: { id: bookListItem.id },
    data: {
      isFavorite: false,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Removed from favorites",
    data: {
      bookListItem: updated,
    },
  });
};

export { toggleFavorite, getFavorites, removeFavorite };