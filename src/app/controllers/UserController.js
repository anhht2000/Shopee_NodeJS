const Users = require('../models/Users')
const bcrypt = require('bcrypt');
const { render } = require('ejs');
const saltRounds = 10;
const jwt = require('jsonwebtoken')


class UserController {
    // [get] /user/register
    index(req, res, next) {
        res.render('user/register')
    }
    // [post] /user/register
    save(req, res, next) {
        const hash = bcrypt.hashSync(req.body.txtPass, saltRounds);
        // res.json(hash)
        let user = new Users({
            username: req.body.txtUser,
            password: hash,
            name: req.body.txtName,
        })
        Users.findOne({username: user.username}).lean()
            .then(data=>{
                if(data){
                    res.render('user/register',{
                        message:'Bạn đã tạo tài khoản thất bại vui lòng nhập lại',
                        color:'text-danger',
                    });
                    return
                }
                else{
                    user.save()
                    .then(user=>{
                        res.render('user/register',{
                            message:'Bạn đã tạo tài khoản thành công. Bạn có thể đăng nhập',
                            color:'text-success'
                        })
                    })
                    .catch(next)
                }
            })
            .catch(next)
    
    }
    // [get] /user/login
    renderLogin(req, res, next){
        res.render('user/login')
    }
    // [post] /user/login
    handdleLogin(req, res, next){
        Users.findOne({username:req.body.txtuserName}).lean()
            .then(data=>{
                if(!data){
                    res.render('user/login',{
                        message:'Tài khoản không tồn tại'
                    })
                    return
                }
                else{
                    if(req.body.txtPassword){
                        //dang nhap thanh cong
                        if(bcrypt.compareSync(req.body.txtPassword, data.password)){
                            let token = jwt.sign({
                                userId: data.id,
                            },process.env.ACCESS_DATA_TOKEN, { expiresIn: '12h' });
                            //luu token va user vao phien dang nhap
                            req.session.token = token;
                            req.session.user = req.body.txtuserName;

                            res.redirect('/')
                            
                            return
                        }
                        else{
                            res.render('user/login',{
                                message:'Mật khẩu hoặc tài khoản sai!'
                            })
                            return
                        }

                    }
                    else{
                        res.render('user/login',{
                            message:'Vui lòng nhập mật khẩu'
                        })
                        return
                    }
                }
            })
            .catch(next)
    }
}

module.exports = new UserController();
