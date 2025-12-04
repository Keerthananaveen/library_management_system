import prisma from "../utils/prisma.js";

export const borrowBook = async(req, res) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(403).json({ message: "Only students can borrow books" });
        }

        const user_id = req.user.user_id;
        const { book_id } = req.body;

        const book = await prisma.books.findUnique({ where: { book_id } });

        if (!book || book.available_copies <= 0) {
            return res.status(400).json({ message: "Book not available" });
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        const borrow = await prisma.borrower.create({
            data: {
                user_id,
                book_id,
                due_date: dueDate,
                status: "Taken"
            }
        });

        await prisma.books.update({
            where: { book_id },
            data: { available_copies: book.available_copies - 1 }
        });

        res.json({ message: "Book borrowed successfully", borrow });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const returnBook = async(req, res) => {
    try {
        const borrow_id = parseInt(req.params.id);

        const borrow = await prisma.borrower.findUnique({ where: { borrower_id: borrow_id } });
        if (!borrow) return res.status(404).json({ message: "Record not found" });

        if (borrow.user_id !== req.user.user_id && req.user.role !== "Librarian") {
            return res.status(403).json({ message: "Not allowed to return this book" });
        }

        const updated = await prisma.borrower.update({
            where: { borrower_id: borrow_id },
            data: { status: "Returned", return_date: new Date() }
        });

        await prisma.books.update({
            where: { book_id: updated.book_id },
            data: { available_copies: { increment: 1 } }
        });

        res.json({ message: "Book returned successfully", updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBorrowRecords = async(req, res) => {
    try {
        let records;

        if (req.user.role === "Librarian") {
            records = await prisma.borrower.findMany({
                include: { user: true, book: true }
            });
        } else {
            records = await prisma.borrower.findMany({
                where: { user_id: req.user.user_id },
                include: { book: true }
            });
        }

        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};