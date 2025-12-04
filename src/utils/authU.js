import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    return jwt.sign({ user_id: user.user_id, username: user.username, role: user.role },
        process.env.JWT_SECRET, { expiresIn: "7d" }
    );
};