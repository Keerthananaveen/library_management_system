import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { generateToken } from "../utils/authU.js";

export const signup = async(req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Please enter USER NAME and PASSWORD" });
        }

        if (await prisma.user.findUnique({ where: { username } })) {
            return res.status(400).json({ error: "Username already exists" });
        }

        if (role !== "Student" && role !== "Librarian") {
            return res.status(400).json({ error: "Role must be either Student or Librarian" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { username, password: hashedPassword, role },
        });

        return res.status(201).json({
            message: "User created",
            user_id: user.user_id,
            username: user.username,
            role: user.role,
            token: generateToken(user),
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async(req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Please enter USER NAME and PASSWORD" });
        }

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(400).json({ error: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: "Invalid credentials" });

        return res.json({
            message: "Successful login",
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
            },
            token: generateToken(user),
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};