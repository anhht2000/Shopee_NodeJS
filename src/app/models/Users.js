const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');


const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    username : {type: String,required: true,maxLength:20},
    password : {type: String,required: true,maxLength:100},
    name: {type: String, default: '', maxLength:255},
    
},{
    timestamps: true,
});

//add plugin
mongoose.plugin(slug);
UserSchema.plugin(mongooseDelete,{
    deletedAt : true,
    overrideMethods: 'all',
})

module.exports = mongoose.model('User', UserSchema,'users') 