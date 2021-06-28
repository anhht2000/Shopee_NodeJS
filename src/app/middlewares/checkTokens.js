const jwt = require('jsonwebtoken')

module.exports = function(req,res,next){
    if(req.session.token){
        jwt.verify(req.session.token,process.env.ACCESS_DATA_TOKEN, function(err, decoded) {
            if(err){
                res.send('wrong tokens');
            }
            else{
                next();
            }
        });
    }
    else{
        res.redirect('/user/login');
        return
    }
    // res.locals.user = req.session.user;
    // next()
}