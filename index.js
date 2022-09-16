const express = require('express');
const app = express();
const port = 5000

const bodyParser = require('body-parser');

const config = require('./config/key');

const {User}=require("./models/User");

const cookieParser = require('cookie-parser')

//application/x-www-form-urlencoded    이렇게 된 데이터를 분석해서 가져올 수 있도록 하는
app.use(bodyParser.urlencoded({extended: true}));

//application/json    json 타입을 가져와서 분석할 수 있도록 하는
app.use(bodyParser.json());

app.use(cookieParser());

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



app.post('/login',(req,res)=>{

  //데이터베이스에서 요청된 email찾기
  User.findOne({email: req.body.email}, (err,user)=>{
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "입력한 이메일은 없는 이메일 입니다."
      })
    }

    //요청된 이메일이 데이터베이스에 있는 이메일과 비밀번호가 같으지 확인
    user.comparePassword(req.body.password, (err,isMatch)=>{
    
      if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

    //비밀번호까지 같다면 토큰을 생성
      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에 >? 쿠키 , 로컬스토리지 , 세션
          res.cookie("x_auth",user.token)
          .status(200)
          .json({loginSuccess: true, userId: user._id})


    })
  })
  })
})



app.listen(port,()=>console.log(`Example app listening on port ${port}!`))