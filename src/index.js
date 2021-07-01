require('dotenv').config();

console.log(process.env.DATABASE_URL);
const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const app = express();
const path = require('path');

//custorm
const route = require('./routes');
const db = require('./config/db')

const port = process.env.PORT || 3000;

db.connect();
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(cookieParser("afdsas+695987987wer")) //to read data from req.cookie
//template engine
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {      // tao cac function render ow day
            sum: function(a,b){
                return a+b;
            },
        },
    }),
); //handlebars config
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource','views'));


//nhung file tinh
app.use(express.static(path.join(__dirname, 'public')));
// session
var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore({
    uri: "mongodb+srv://tuananh_dubai:123456aA@cluster0.kmi9a.mongodb.net/shoppee_manage?retryWrites=true&w=majority",
    collection: 'mySessions'
    });
    
  // Catch errors
    store.on('error', function(error) {
        console.log(error);
    });
app.use(session({
    secret: process.env.ACCESS_DATA_SESSION,
    resave: true,  //de no luu lai moi khi refesh lai trang
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: store,
}))

// app.use("/",function(req,res,next){
//     res.send("OK nhes")
// })
route(app);


//handle throw ERROR
app.use((err,req,res,next)=>{
    const error = app.get("env") === "development" ? err : {};
    const status = err.status || 500 ;
    //response to client
    return res.status(status).json({
        error:{
            message: error.message
        }
    })
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});