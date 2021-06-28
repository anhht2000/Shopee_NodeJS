const homeRouter = require('./home')
const userRouter = require('./user')
const checkToken = require('../app/middlewares/checkTokens')
const productRouter = require('./product')

var mdw = function(req,res,next){
    let valueCart
    if(req.session.cart){
        valueCart = Object.values(req.session.cart);
    }
    else{
        valueCart = [];
    }
    let count = valueCart.reduce(function(cou,item,index){
        return cou+= item;
    },0);
    //
    res.locals.user = req.session.user;
    res.locals.countCart = count;
    next();
}

function route(app) {
    //user/...
    app.use('/user',mdw,userRouter)
    //product/...
    app.use('/product',mdw,checkToken,productRouter) //
    //appuse
        // app.use("/setCookie",function(req,res,next){
        //     req.session.destroy(function(err){
        //         console.log("EEeee",err);
        //     })
        // })
        // app.use("/testCookie",function(req,res,next){
        //     console.log("ssID",req.sessionID);
        //     console.log("token",req.session.token);
        //     console.log("cookie",req.signCookies);
        //     res.send("req.session.token")
        // })
        // app.use("/again",function(req,res,next){
        //     req.session.regenerate(function(err) {
        //         console.log("EEeee",err);
        //         console.log("ssID",req.sessionID);
        //         console.log("token",req.session.token);
        //         console.log("user",req.session.user);
        //     })
        //     res.send("OK")
        // })
        //
        app.use('/',mdw,homeRouter) //   
    }

module.exports = route;
