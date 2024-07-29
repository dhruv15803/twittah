import jwt from 'jsonwebtoken';
export const authenticateUser = (req, res, next) => {
    if (!req.cookies?.auth_token)
        return res.status(400).json({ "success": false, "message": "No auth_token cookie found" });
    const decoded = jwt.verify(req.cookies.auth_token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    req.userId = userId;
    next();
};
