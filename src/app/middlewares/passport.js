const passport = require('passport');
const JwtStrategy = require("passport-jwt").Strategy;
//local
const LocalStrategy = require("passport-local").Strategy;
//google
var GooglePlusTokenStrategy = require('passport-google-oauth20').Strategy;
//facebook
var FacebookTokenStrategy = require('passport-facebook').Strategy;
//
const ExtractJwt  = require("passport-jwt").ExtractJwt;
const userAcc = require("../models/Users");


//config passport-jwt
passport.use(new JwtStrategy({
  jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"), //Bearer token tu client gui len
  secretOrKey:"thisisAccessToken",
},async function(payload,done){  //thanh cong thi se co payload va done == next goi no se di den controler de xu ly
  try{
    // console.log("payloda",payload);
    let account = await userAcc.findOne({_id:payload.sub}) //lấy ra id
    if(!account){
      done(null,false) //k co loi va k trar ve gi
    }
    done(null,account) // k co loi va tra ve account gan no vao req.user
  }
  catch(err){
    done(err,false) //k cho qua
  }
}))
//config passport gg
passport.use(new GooglePlusTokenStrategy({
  clientID: "332676904403-aakgensnn5747h9h2722upmirke6fqe5.apps.googleusercontent.com",
  clientSecret: "HFjMOqu6ML0q5rRwx94VZFZr",
  callbackURL: "http://localhost:3000/user/auth/google/callback",
},async function(accessToken, refreshToken, profile, done) {
  try{
    //CHECKK  xem tài khoản này đã tồn tại trong db chưa
    const account = await userAcc.findOne({
      authType:"google",
      authGoogleID:profile.id,
    })
    console.log(profile);
    if(account) return done(null,account) //k co loi va tra ve account gan no vao req.user
    //if non-account, i will create new account
    const newAcc = new userAcc({
      username: profile.emails[0].value,
      authType: "google",
      authGoogleID: profile.id,
    })
    await newAcc.save();
    done(null,newAcc);
  }
  catch(err){
    done(err,false);
  }
}));
//config passport facebook
passport.use(new FacebookTokenStrategy({
  clientID: "535301504490580",
  clientSecret: "3a0e13d9c43ed4baeec8b07734b0f74a",
  callbackURL: "https://7e01c6cf7cb8.ngrok.io/user/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email'],
},async function(accessToken, refreshToken, profile, done) {
  try{
    //CHECKK  xem tài khoản này đã tồn tại trong db chưa
    const account = await userAcc.findOne({
      authType:"facebook",
      authFacebookID:profile.id,
    })
    if(account) return done(null,account) //k co loi va tra ve account gan no vao req.user
    //if non-account, i will create new account
    const newAcc = new userAcc({
      username: profile.emails[0].value,
      authType: "facebook",
      authFacebookID: profile.id,
      name: profile._json.name,
    })
    await newAcc.save();
    done(null,newAcc); //k co loi va tra ve account gan no vao req.user
    
    //đến đây nó sẽ đẩy vào phần serializeUser(lưu session) lưu newAcc vào session
  }
  catch(err){
    done(err,false);
  }
}));
//config passport local
passport.use(new LocalStrategy({
  usernameField: "txtuserName",  //cai nay phai dung voi cai nguoi dung post len
  passwordField: "txtPassword"
},async function(username, password, done) { //user,password la do nguoi dung truyen vao
    try {
      console.log(username,password);
      const account = await userAcc.findOne({username:username,authType:"local"});
      if(!account)
      {
        return done(null,false)
      };
      const isCorrectPassword = await account.isValidPassword(password);
      if(!isCorrectPassword) return done(null,false);
      console.log("thanh cong");
      done(null,account) // k co loi va tra ve account gan no vao req.user
    } catch (error) {
      done(error,false)
    } 
  }
));

//file nay chi de config cho passport hieu jwt thoi