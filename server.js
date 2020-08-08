const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
var user_list= [];

const app = express();
const router = express.Router();
const port = process.env.PORT || 80;
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({limit : '1mb'}));
//start server
server.listen(port, () => {
    console.log('listening to port : ', port);
    console.log('server started');
});

io.on('connection', socket => {
    socket.on('join', user => {
        user_list.push(user);
        console.log(user_list)
        socket.emit('msg', {
            responce: 'welcome',
            users : user_list,
        });
    
        socket.broadcast.emit('user-join', {
            message: user,
            users: user_list,
            status: true
        });

        socket.on('disconnect', () => {
            removeUser(user);
            io.emit('user-disconnect', {
                message: user,
                users: user_list,
                status: false
            });
        });
    });

    socket.on('chat-message', info => {
        var values = {
            user: info.user,
            timestamp: moment().format('h:mm a'),
            message: info.message
        }
        io.emit('chat-update', values);
    });
});

function removeUser(value){
    const index = user_list.indexOf(value);
    console.log(user_list);
    if(index != -1){
        user_list.splice(index, 1)
    }
    console.log(user_list);
}