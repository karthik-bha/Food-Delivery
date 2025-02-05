import jwt from "jsonwebtoken";

export default decodeToken = (token) => {
    try {
        const decoded = jwt.decode(token);
        return decoded?.role; // Return the role
    } catch (error) {
        return null;
    }
};
