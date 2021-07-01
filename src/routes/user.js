const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

const passport = require("passport");
const passportConfig =  require("../app/middlewares/passport");

const userController = require('../app/controllers/UserController')

//khoi tao passport
router.use(passport.initialize())
router.use(passport.session());

//tự động lưu session
passport.serializeUser(function(data, done) {
    
    done(null, data); // next sang bước tiếp
});
//doc session qua req trực tiếp được, đọc qua req.user
passport.deserializeUser(function(data, done) {
    done(null, data);
});

router.get('/home',function(req,res,next){
    res.json(req.user) //= req.session.passport.user
})

//signUp
router.get('/register',userController.index)
router.post('/register',userController.save)
//signIn
router.get('/login',userController.renderLogin)
router.post('/login', passport.authenticate('local'),userController.handdleLogin)
//logout
router.get("/logout",function(req,res,next){
    req.session.destroy(function(err) {
        next(err)
    })
    res.redirect("/")
})

//signIn with Face
    //yeu cau xac thuc fb
    router.get('/auth/facebook',passport.authenticate('facebook',
    { authType: 'reauthenticate', scope: ['email'] }
    ))
    // xử lý sau khi user cho phép xác thực với facebook
    router.get('/auth/facebook/callback',
            passport.authenticate('facebook'), 
            //middleware xu ly gan token // tu serializeUser sang day
            function(req,res,next){
                //luu token
                let token = jwt.sign({
                    userId: req.user.authFacebookID,
                },process.env.ACCESS_DATA_TOKEN, { expiresIn: '12h' });
                //luu token va user vao phien dang nhap, req.user chính là session
                console.log("show",req.user.authFacebookID);
                req.session.token = token;
                req.session.user = req.user.name;
                res.redirect("/");
            }
        );

//signIn with GG
            //yeu cau xac thuc fb
    router.get('/auth/google',passport.authenticate('google', { scope:[ 'email', 'profile' ] }))
    // xử lý sau khi user cho phép xác thực với facebook
    router.get('/auth/google/callback',
            passport.authenticate('google'), 
            //middleware xu ly gan token // tu serializeUser sang day
            function(req,res,next){
                //luu token
                let token = jwt.sign({
                    userId: req.user.authGoogleID,
                },process.env.ACCESS_DATA_TOKEN, { expiresIn: '12h' });
                //luu token va user vao phien dang nhap
                console.log("show",req.user);
                req.session.token = token;
                req.session.user = req.user.username;
                res.redirect("/");
            }
        );




module.exports = router;