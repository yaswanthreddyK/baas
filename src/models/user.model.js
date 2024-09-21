
import mongoose, { model, Mongoose, Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'email is required.'],
    },
    password: {
        type: String,
        required: [true, 'password is required.']
    },
    project_ids: [
        {
            type:  mongoose.Types.ObjectId,
            ref: 'projects',
            default: []
        }
    ],
})

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 10)
    return next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function (){
    return jwt.sign({
        _id: this._id,
        email: this.email,
    }, process.env.HASH_SECRET, {expiresIn: process.env.TOKEN_EXPIRY})
}

const User = model('Users', userSchema)

export default User

