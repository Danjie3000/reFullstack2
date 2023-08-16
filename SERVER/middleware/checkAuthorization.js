import jwt from 'jsonwebtoken';

const checkAuth = async (req, res, next) => {
    const token = req.headers['token']
    if(!token) {
        return res.status(400).json({
            message: "No token found."
        });
    } try {
        const user = await jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = user.email
        next()
    } catch (error) {
        console.error("Token Verification Error:", error);
        res.status(400).json({
            error: "No valid token found."
        });
    };
};

export default checkAuth;