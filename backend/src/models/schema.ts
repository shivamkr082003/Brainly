import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const UserSchema = new Schema ({
    username: {
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    },
    isPublic:{
        type:Boolean,
        default:false
    }
})

export const UserModel = mongoose.model("User", UserSchema) 


const contentTypes = ['tweet', 'youtube', 'article', 'audio'];

const ContentSchema = new Schema ({
    link: {
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:contentTypes,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    tags: {
        type:[String]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId, ref: 'User',
        required:true
    },
    username:{
        type:String, ref: 'User',
        required:true
    }
})

export const ContentModel = mongoose.model("Content" , ContentSchema);