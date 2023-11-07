import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../database/userDB.js';
import checkAuth from '../middleware/checkAuthorization.js';

const router = Router();

router.post('/register', checkAuth, async (req, res) => { // Only possible to register new account if logged in.
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        const result = await user.save();
        const { password, ...data } = await result.toJSON();

        // Generate JWT token. Authorization.
        const token = await jwt.sign({ user: data }, process.env.TOKEN_SECRET, { expiresIn: 43200 }); // Token expires after 12 hours.
        res.json({ user: data, token });
        console.log("New user added.");

    } catch (error) {
        res.status(500).send({ message: "Registration failed.", error: error.message });
    };
});

router.post('/', async (req, res) => { // Authenticate.
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(400).send({
            message: "Invalid Credentials."}); // Only "credentials" in error for more safety. 
    } if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: "Invalid Credentials."});
    };
    // Generates JWT token. Authorization.
    const token = await jwt.sign({ user, username: user.name }, process.env.TOKEN_SECRET, {expiresIn: 43200}); // Token expires after 12 hours.
    res.json({token});
});

router.get('/test', checkAuth, (req, res) => { // ONLY for testing if authorization works. *In Postman.
    console.log("works");
});

router.post('/logout', checkAuth, (req, res) => {
    localStorage.removeItem('token');
    res.token('jwt', '', {maxAge: 0}); // Makes the token pre-expire.
});

export default router;