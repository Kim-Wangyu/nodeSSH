const mongoose = require('mongoose')


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

const User = mongoose.model('User', userSchema)

module.exports={User}