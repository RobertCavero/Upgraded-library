import { prisma } from "../config/db.js";

const addToBooklist = async (req, res) => {
  const { bookId, status, rating, notes } = req.body;

  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    return res.status(404).json({
      error: "Book not found",
    });
  }

  const existingInBooklist = await prisma.bookListItem.findUnique({
    where: {
      userId_bookId: {
        userId: req.user.id,
        bookId: bookId,
      },
    },
  });

  if (existingInBooklist) {
    return res.status(400).json({
      error: "Book already in the watchlist",
    });
  }

  const bookListItem = await prisma.bookListItem.create({
    data:{
        userId: req.user.id,
        bookId,
        status: status || "PLANNED",
        rating, 
        notes
    }

  });


  res.status(201).json({
    status: "success",
    data:{
        bookListItem,
    }
  });
};



const updateBooklistItem = async (req, res) =>{
  const {status , rating , notes} = req.body;

  const bookListItem = await prisma.bookListItem.findUnique({
    where: {id: req.params.id},
  });
  if (!bookListItem) {
    return res.status(404).json({
      error: "Booklist item not found",
    });
  }

  if(bookListItem.userId !== req.user.id){
    return res.status(403).json({
      error: "Not allowed to update this booklist item"
    })
  }


  const updateData = {};

  if(status !== undefined) updateData.status = status.toUpperCase();
  if(rating !== undefined) updateData.rating = rating;
  if(notes !== undefined) updateData.notes = notes;

  const updatedItem = await  prisma.bookListItem.update({
    where: { id: req.params.id },
    data: updateData,
  })

 
  res.status(200).json({
    status: "success",
    data: {
      watchlistItem: updatedItem,
    },
  });


}








const removeFromBooklist = async (req, res) =>{
  const bookListItem = await prisma.bookListItem.findUnique({
    where: {id: req.params.id},
  });
  if (!bookListItem) {
    return res.status(404).json({
      error: "Booklist item not found",
    });
  }

  if(bookListItem.userId !== req.user.id){
    return res.status(403).json({
      error: "Not allowed to update this booklist item"
    })
  }

  await prisma.bookListItem.delete({
    where: {id: req.params.id},
  })

  res.status(201).json({
    status: "success",
    message: "Book removed from booklist"
  });


}





export {addToBooklist, removeFromBooklist, updateBooklistItem}