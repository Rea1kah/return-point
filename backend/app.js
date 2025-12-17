const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const itemRoutes = require('./src/routes/itemRoutes');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    'https://return-point-plum.vercel.app',
    'http://localhost:5173'
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

let chatHistory = {}; 

io.on('connection', (socket) => {
    
    socket.on('register_user', (userId) => {
        if (!userId) return;
        
        const userRooms = [];
        const uidStr = String(userId);

        Object.keys(chatHistory).forEach(roomId => {
            if (roomId.includes(uidStr)) {
                const messages = chatHistory[roomId];
                if (messages.length > 0) {
                    const lastMsg = messages[messages.length - 1];
                    userRooms.push({
                        roomId,
                        lastMessageData: lastMsg
                    });
                }
            }
        });

        socket.emit('sync_conversations', userRooms);
    });

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        if (chatHistory[roomId]) {
            socket.emit('load_history', chatHistory[roomId]);
        }
    });

    socket.on('send_message', (data) => {
        if (!chatHistory[data.room]) {
            chatHistory[data.room] = [];
        }
        chatHistory[data.room].push(data);
        
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('delete_conversation', (roomId) => {
        delete chatHistory[roomId];
    });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});