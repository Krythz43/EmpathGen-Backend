const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

let leaderboard = new Map();
let words = new Map();


io.on('connection',(socket) => {
    console.log(`New Websocket Connection!`);

    socket.emit('welcomeMessage',"Hi and welcome to the site!")

    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdated',count)
    //     io.emit('countUpdated',count)

    // })

    socket.on('sendMessage', (message) => {
        io.emit('welcomeMessage',message)
    })

    socket.on('newUser',(user) => {
        console.log(user +" has joined the room.");
        leaderboard.set(user,0);
        console.log(leaderboard)

        if(user === "goodmode"){
            leaderboard = new Map();
            words = new Map();
        }
    })

    socket.on('addGlyph', (data) => {
        console.log(data);
        let user = data[0];
        let wordssofar = new Set(data[1]);
        console.log(user," ",wordssofar);

        for(let item of wordssofar){
            let temp = new Set();
            if(words.has(item)){
                temp = words.get(item);
            }
            else{
                words.set(item,new Set());
            }

            temp.add(user);
            words.set(item,temp);
        }

        for(let key of leaderboard.keys()){
            let score = 0;
            for(let [word,users] of words){
                if(users.has(key)){
                    score += users.size - 1;
                }
            }
            leaderboard.set(key, score);
        }

        console.log("Leader board after adding Glyph:", leaderboard);
        
        const LeaderBoardObject = Object.fromEntries(leaderboard);
        io.emit('getLeaderBoard',LeaderBoardObject)

        let wordscore = new Map();

        for(let word of wordssofar){
            wordscore.set(word,words.get(word).size - 1);
        }

        const wordscoreObject = Object.fromEntries(wordscore);
        socket.emit('wordscore',wordscoreObject)
    })
})



server.listen(port, () => {
    console.log("Server is up on port ",port)
})