const express = require('express');
const app = express();
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Kim-Wangyu:dhksrbsla12@nestcluster.occnbqe.mongodb.net/test',).then(()=>console.log('MongoDB Connected...'))
  .catch(err=>console.log(err))

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) =>res.send("hellot World"))

app.listen(port,()=>console.log(`Example app listening on port ${port}!`))