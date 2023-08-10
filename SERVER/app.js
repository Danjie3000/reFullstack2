import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({credentials: true, origin: true}));
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);

//                          Database v
async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }); 
    console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB', error.message);
    };
};
connect();
//                          Database ^

//                          Socket v
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["*"]
    }
});

const users = {}; // Temporary user for chatting.

io.on('connection', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name);
    });
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id]});
});
//                          Socket ^

//import forgotPasswordMailer from './util/mailer.js'
import userRouter from './routers/userRouter.js';
//import todoRouter from './routers/todoRouter.js';
app.use(userRouter);

/************************************************************************************************************************************/

const PORT = 8080;
server.listen(PORT, (error) => {
    if (error) {
        console.log("error: ", error);
        return;
        }
        console.log("The server is running on port: ", PORT);
});