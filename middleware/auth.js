const { User } = require("../models/User");


let auth = (req,res,next)=>{

    //인증처리를 하는곳

    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
   // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.


    //이렇게 나와있는데요    Cookie 해더를 분석한후에  req.cookies 에 다가 분석된 것을 넣어주는 역할을 합니다 

    //토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err,user)=>{
        if(err) throw err;
        if(!user)return res.json({isAuth: false,error: true})

        req.token= token
        req.user = user;
        next()
    })

    //유저가 없으면 인증 OKAY

    //유저가 없으면 인증 No!

}

module.exports = {auth};