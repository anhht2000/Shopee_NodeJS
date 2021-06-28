const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');


const Schema = mongoose.Schema; 

const ProductSchema = new Schema({
    title: {type: String, default: '', maxLength:255},
    oldPrice: {type: Number},
    star: {type: Number},
    brand:{type: String},
    origin:{type: String},
    sale:{type:String},
    newPrice: { type: Number},
    image: {type: String},
    isLiked: {type: Boolean,default:true},
},{
    timestamps: true,
});

//add plugin
mongoose.plugin(slug);
ProductSchema.plugin(mongooseDelete,{
    deletedAt : true,
    overrideMethods: 'all',
})

module.exports = mongoose.model('Product', ProductSchema,'products') 