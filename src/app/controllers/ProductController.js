const Products = require('../models/Products')
const path = require('path');
const { render } = require('ejs');


class UserController {
    // [get] /product/create
    index(req, res, next) {
        res.render('products/create');
    }
    // [post] /product/create

    create(req, res, next) {
        let products = new Products({
            title:req.body.title,
            oldPrice:req.body.oldPrice,
            star:req.body.star,
            brand:req.body.brand,
            origin:req.body.origin,
            sale:req.body.sale,
            newPrice:req.body.newPrice,
            image:req.file.filename,
            isLiked:Boolean(req.body.isLiked),
        })
        products.save();
        res.redirect('/product/statistic');
    }
    //[get]product/statistic
    store(req, res, next) {
        Promise.all([Products.countDocumentsDeleted(),Products.find({}).lean()])
            .then(([countdele,products])=>{
                res.render('products/statistic',{
                    products,
                    countdele,
                })
            })
            .catch(next)
    }
 //[get]product/edit
    getEdit(req, res, next) {
        Products.findOne({_id:req.params.id}).lean()
            .then(product=>{
                res.render('products/edit',{
                    product,
                })
            })
            .catch(next)
    }
    //edit
    postEdit(req, res, next) {
        Products.updateOne({_id:req.params.id},{
            title:req.body.title,
            oldPrice:req.body.oldPrice,
            star:req.body.star,
            brand:req.body.brand,
            origin:req.body.origin,
            sale:req.body.sale,
            newPrice:req.body.newPrice,
            image:req.file.filename,
            isLiked:Boolean(req.body.isLiked),
        }).lean()
            .then(product=>{
                res.redirect('/product/statistic')
            })
            .catch(next)
    }
    //delete
    postDelete(req, res, next) {
        Products.delete({_id:req.params.id})
            .then(()=>{res.redirect('/product/statistic')})
            .catch(next)
    }
    //Listdeletehard
    getDeletetrash(req, res, next) {
        Products.findDeleted({}).lean()
            .then((products)=>{
                res.render('products/trash',{
                products,
                })
            })
            .catch(next)
    }
    //postdeletehard
    postDeletetrash(req, res, next) {
        // res.json(req.params.id)
        Products.deleteOne({_id:req.params.id})
            .then(()=>{res.redirect('/product/delete/trash')})
            .catch(next)
    }
    //restore
    restoreTrash(req, res, next) {
        Products.restore({_id:req.params.id})
            .then(()=>{res.redirect('/product/delete/trash')})
            .catch(next)
    }
    //detail
    async detailProcduct(req,res,next){
        try{
            // throw new Error("Loi roi")
            let productId = req.params.idProduct;
            let product = await Products.findOne({_id:productId}).lean();
            // console.log(product);
            res.render("products/detailProduct",{
                product,
            })
        }
        catch(err){
            next(err)
        }
    }
    //cart
    async addCart(req,res,next){
        try {
            let count;
            if(!req.session.cart){
                req.session.cart = {}
            }
            // else{
            // }
            if(!req.session.cart[req.params.idProduct]){
                count = 0
            }
            else{
                count = req.session.cart[req.params.idProduct];
            }
            req.session.cart[req.params.idProduct] = count + 1
            // res.send(req.session.cart);
            // console.log(req.session.cart);
            res.redirect("/");
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController();
