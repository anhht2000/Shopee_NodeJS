const Products = require('../models/Products')
class HomesController {
    // [get] /home
    index(req, res, next) {
        let currentPage = req.query.index || 1;
        let pageIndex = 5;
        let start = (currentPage-1) * pageIndex;
        let end = currentPage * pageIndex;
        
        Promise.all([Products.find({}).lean(),Products.countDocuments({})])
            .then(function([data,count]){
                data = data.slice(start,end)
                console.log(Math.ceil(count/pageIndex));
                res.render('home',{
                    products:data,
                    count:Math.ceil(count/pageIndex),
                })
            })
            .catch(function(err){
                next(err)
            })

        // Products.find({}).lean()
        //     .then(data=>{
        //         let max = data.length / pageIndex;
        //         if((data.length % pageIndex)!==0){max+=1}
        //         data = data.slice(start,end)
        //         res.render('home',{
        //             products:data,
        //             max,
        //         })
        //     })
    }
}

module.exports = new HomesController();
