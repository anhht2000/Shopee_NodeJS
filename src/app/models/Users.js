const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const bcrypt = require("bcrypt");


const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    username : {
        type: String,
        lowercase:true
    },
    password : {type: String},
    name: {type: String},
    authGoogleID:{
        type:String,
        default:null,
    },
    authFacebookID:{
        type:String,
        default:null,
    },
    authType:{
        type:String,
        enum:["local","google","facebook"], //chỉ cho nó chọn 1 trong các kiểu trong mảng kia thôi
        default:"local"
    },
},{
    timestamps: true,
});

//add plugin
mongoose.plugin(slug);
UserSchema.plugin(mongooseDelete,{
    deletedAt : true,
    overrideMethods: 'all',
})

//xay dung 1 ham de duoc goi.cai nay phai duoc goi moi chay
UserSchema.methods.isValidPassword = async function(newPass){
    try {
        return await bcrypt.compare(newPass,this.password)
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = mongoose.model('User', UserSchema,'users') 