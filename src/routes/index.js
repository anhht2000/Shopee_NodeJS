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
    //home
    app.use('/',mdw,homeRouter) //   
    }

module.exports = route;
