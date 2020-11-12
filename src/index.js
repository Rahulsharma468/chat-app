const express = require('express')
const path = require('path')
const http = require('http')
const port = process.env.PORT || 3000
const socket_io = require('socket.io')
const Filter = require('bad-words')
const { generate_message , generate_loc_messages } = require('./utils/messages')
const {Adduser,Getuser,Allusers,Removeuser} = require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socket_io(server)

const publicdir = path.join(__dirname,'../public')
app.use(express.static(publicdir))

// let count = 0

io.on('connection',(socket)=>{
    console.log('New Connection')

    // socket.emit('countUpdated',count
    socket.on('join' ,({username,room} , callback)=>{
        const {error ,user} = Adduser({
            id: socket.id,
            username,
            room
        })
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generate_message('Admin' , 'Welcome'))
        socket.broadcast.to(user.room).emit('message',generate_message('Admin' , `${user.username} has Joined The Chatroom`))
        io.to(user.room).emit('Room Data',{
            room: user.room,
            users: Allusers(user.room)
        })
        callback()
    })
    socket.on('sendMessage',(data, callback)=>{//first is always name of event we do and after that the data is thedata provided can be nmaed anything
        const filter = new Filter()
        if(filter.isProfane(data)){
            return callback('No Bad Words')
        }
        const user = Getuser(socket.id)
        io.to(user.room).emit('message',generate_message(user.username , data))
        callback()
    })


 
    socket.on('sendLoc',(data,sharer)=>{//first is always name of event we do and after that the data is thedata provided can be nmaed anything
        const user = Getuser(socket.id)
        io.to(user.room).emit('Locmessage',generate_loc_messages(user.username , `https://google.com/maps?q=${data.latitude},${data.longitude}`))
        sharer()
    })
    // socket.on('increment',()=>{
    //    count++
    //    //socket.emit('countUpdated',count)
    //    io.emit('countUpdated',count)
    // })
    socket.on('disconnect',()=>{
        const user = Removeuser(socket.id)
        if(user){
            io.to(user.room).emit('message',generate_message('Admin' , `${user.username} has left the Chatroom`))
            io.to(user.room).emit('Room Data',{
                room: user.room,
                users: Allusers(user.room)
            })
        }
        
    })
})

server.listen(port,()=>{
    console.log('App is on port '+ port)
})