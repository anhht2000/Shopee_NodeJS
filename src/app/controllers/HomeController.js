const Products = require('../models/Products')
class HomesController {
    // [get] /home
    index(req, res, next) {
        let currentPage = req.query.index || 1;
        let pageIndex = 5;
        let start = (currentPage-1) * pageIndex;
        let end = currentPage * pageIndex;
        Products.find({}).lean()
            .then(data=>{
                let max = data.length / pageIndex;
                if((data.length % pageIndex)!==0){max+=1}
                data = data.slice(start,end)
                res.render('home',{
                    products:data,
                    max,
                })
            })
    }
}

module.exports = new HomesController();
