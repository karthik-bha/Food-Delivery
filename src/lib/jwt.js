import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET;

// We will embed stuff like _id in the payload
export const signToken = (user) => {
    const { _id, email, role, office_id } = user;
    const payload = { _id, email, role, office_id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }); // Token expires in 1 day
    return token;
}

// Verifying the token
export const verifyToken = (token) => {
    try {
        // Decode and verify the token
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            console.error("Token has expired");
        } else if (err.name === "JsonWebTokenError") {
            console.error("Invalid token");
        } else {
            console.error("Token verification error", err);
        }
        return null; // Return null if the token is invalid or expired
    }
};