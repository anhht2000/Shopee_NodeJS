// Tao ket noi den database
const mongoose = require('mongoose');

async function connect(params) {
    try{
        await mongoose.connect("mongodb+srv://tuananh_dubai:123456aA@cluster0.kmi9a.mongodb.net/shoppee_manage?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Connect succesfully!!')

    }
    catch{
        console.log('Connect fail!!')
    }
}

module.exports = { connect}