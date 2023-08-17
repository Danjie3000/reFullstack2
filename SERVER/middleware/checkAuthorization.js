// import jwt from 'jsonwebtoken';

// const checkAuth = async (req, res, next) => {
//     const token = req.headers['token']
//     if(!token) {
//         return res.status(400).json({
//             message: "No token found."
//         });
//     } try {
//         const user = await jwt.verify(token, process.env.TOKEN_SECRET)
//         req.user = user.email
//         next()
//     } catch (error) {
//         console.error("Token Verification Error:", error);
//         res.status(400).json({
//             error: "No valid token found."
//         });
//     };
// };

// export default checkAuth;

import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decodedToken.user; // Set decoded user object in req.user
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export default checkAuth;
