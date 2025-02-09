import { SignJWT, jwtVerify } from "jose";  // Import from jose
const JWT_SECRET = process.env.JWT_SECRET;

// We will embed stuff like _id in the payload
export const signToken = async (user) => {
    const { _id, email, role } = user;
    const payload = { _id, email,role};

    // Create and sign the JWT with 'jose'
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })  // Specify algorithm (HS256)
        .setExpirationTime('1d')  // Set expiration
        .sign(new TextEncoder().encode(JWT_SECRET));  // Sign with the secret

    return token;
} 

// Verifying the token
export const verifyToken = async (token) => {
    try {
        if (typeof token !== "string") {
            token = token?.value;  // Extracting the actual token string from object
        }

        // Decode and verify the token with 'jose'
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        return payload;
    } catch (err) {
        if (err.name === "JWTExpired") {
            console.error("Token has expired");
        } else if (err.name === "JWTClaimValidationFailed") {
            console.error("Invalid token");
        } else {
            console.error("Token verification error", err);
        }
        return null; // Return null if the token is invalid or expired
    }
};
