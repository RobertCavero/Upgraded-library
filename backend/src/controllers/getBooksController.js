import { prisma } from "../config/db.js";

const getBooks = async (req, res) => {
    try {
        const books = await prisma.book.findMany();
        console.log("BOOKS FROM DB:", books);

        res.status(200).json({
            status: "success",
            data: books,
        })
    } catch(error){
        console.error("GET BOOKS ERROR:", error);
        res.status(500).json({
            error: "Failed to fetch books",
        })
    }
}

export default getBooks