import prisma from "../utils/prisma.js";

export const getUsers = async(req, res) => {
    try {
        if (req.user.role !== "Librarian") {
            return res.status(403).json({ message: "Only Librarian can view users" });
        }

        const users = await prisma.user.findMany({
            include: {
                borrowers: {
                    include: { book: true }
                }
            }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProfile = async(req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: req.user.user_id },
            include: {
                borrowers: {
                    include: { book: true }
                }
            }
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};