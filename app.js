const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const {
        userJoin,
        userLeft,
        getRoomUsers,
        getRoom,
        formatMessage 
        }       = require('./utils/chat')

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/chat', (req, res)=>{
    res.render('chat');
})

io.on('connection', (socket) => {
    socket.on('joinUser', (user)=>{
        console.log(user.username);
        socket.join(user.room, ()=>{
            userJoin(user, socket.id)
            io.to(user.room).emit('roomUsers', getRoomUsers(user.room));
            io.to(socket.id).emit('welcome', user.username);
            socket.to(user.room).emit('userJoin', user.username);
        })
    });

    socket.on('message', (msg)=>{
        const user = getRoom(socket.id);
        io.to(socket.id).emit('messageSelf', formatMessage(msg, user.username));
        socket.to(user.room).emit('messageRest', formatMessage(msg, user.username));

    })

    socket.on('disconnect', () => {
        const user = getRoom(socket.id);
        if(user){
            socket.to(user.room).emit('userLeft', user.username);
            userLeft(socket.id);
            io.to(user.room).emit('roomUsers', getRoomUsers(user.room));
        }
      console.log('user disconnected');
    });
  });

  const PORT = process.env.PORT || 3000;
  http.listen(PORT, () => console.log(`Server running on port ${PORT}`));