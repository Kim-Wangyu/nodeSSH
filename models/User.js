const mongoose = require('mongoose')

const bcrypt = require('bcrypt');
const saltRounds = 10

const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, //wan gyu@naver.com 이러면 띄어쓰기 없애줌
        unique:1
    },
    password: {
        type: String,
        minlength: 5

    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role:{
        type: Number,
        default: 0
    },
    image: String,
    token:{
        type: String
    },
    tokenExp:{ //유효기간
        type: Number
    }

})
//user.save를 하기 전에 뭔가를 하고 user.save를 실행
userSchema.pre('save', function(next){

    var user = this; //이거를 써야 밑에서 password를 가져올 수 있음. this는 위 데이터를 말함


    if(user.isModified('password')){
            //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)


            bcrypt.hash(user.password, salt, function(err, hash) {
            // Store hash in your password DB.
                if(err) return next(err)
                user.password = hash // 플래인 패스워드를 해쉬된 비밀번호로 교체를 해주는 것
                next()
            });
        });
    } else{
        next()
    }

})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 1234567   암호화된 password $2b$10$m6CZCmXrK7.snoqdb6z/M.Y4KOPwB54QMYTg8pv9bYICJ6N8VdN6q
    console.log("plain"+plainPassword)
    console.log("pw"+this.password)
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        console.log("match"+isMatch)
        if(err) return cb(err)
        cb(null,isMatch)
    })
}


userSchema.methods.generateToken = function(cb){

    var user = this;

    //jsonwebtoken을 이용해 token생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    //user._id + 'secretToken' = token
    //->
    // ' secretToken -> iser._id

    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })

}


userSchema.statics.findByToken = function(token,cb){
    var user= this;


    // user._id + "" = token

    //토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err,decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err,user){
            if(err) return cb(err);
            cb(null,user )
        })
    })
}


const User = mongoose.model('User', userSchema)

module.exports={User}