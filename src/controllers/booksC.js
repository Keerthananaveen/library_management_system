import prisma from "../utils/prisma.js";

export const createBook = async(req, res) => {
    try {
        if (req.user.role !== "Librarian") {
            return res.status(403).json({ message: "Only Librarian can add books" });
        }

        const { title, author, publisher, publication_year, available_copies } = req.body;
        if (!title || !author || !publication_year || available_copies == null) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingBook = await prisma.books.findFirst({
            where: { title }
        });
        if (existingBook) {
            return res.status(400).json({ error: "Book already exists" });
        }

        const book = await prisma.books.create({
            data: {
                title,
                author,
                publisher,
                publication_year,
                available_copies,
            },
        });
        res.json({ message: "Book added", book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBooks = async(req, res) => {
    try {
        const books = await prisma.books.findMany();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBookById = async(req, res) => {
    try {
        const book_id = parseInt(req.params.id);
        const book = await prisma.books.findUnique({ where: { book_id } });
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateCopies = async(req, res) => {
    try {
        if (req.user.role !== "Librarian") {
            return res.status(403).json({ message: "Only Librarian can update copies" });
        }

        const book_id = parseInt(req.params.id);
        const { available_copies } = req.body;

        const book = await prisma.books.update({
            where: { book_id },
            data: { available_copies }
        });

        res.json({ message: "Copies updated", book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};