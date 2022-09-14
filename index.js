const express = require('express');
const app = express();
const port = 5000

const bodyParser = require('body-parser');

const config = require('./config/key');

const {User}=require("./models/User");

//application/x-www-form-urlencoded    이렇게 된 데이터를 분석해서 가져올 수 있도록 하는
app.use(bodyParser.urlencoded({extended: true}));

//application/json    json 타입을 가져와서 분석할 수 있도록 하는
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI).then(()=>console.log('MongoDB Connected...'))
  .catch(err=>console.log(err))









// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) =>res.send("hellotttttt World"))



app.post('/register',(req,res)=>{
  //회원가입 할 때 필요한 정보들을 client에서 가져오면 
  //그것들을 데이터 베이스에 넣어준다.

  // {
  //   id: "hello",
  //   password 
  // } 아래의 req.body에 이런식으로 담겨서 올텐데. bodyparser가 이렇게 담겨서 오도록 도와주는 것

  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})





app.listen(port,()=>console.log(`Example app listening on port ${port}!`))