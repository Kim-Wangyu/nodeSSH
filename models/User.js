const mongoose = require('mongoose')

const bcrypt = require('bcrypt');
const saltRounds = 10


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
    }

})

const User = mongoose.model('User', userSchema)

module.exports={User}