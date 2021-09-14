const db = require('../model');
const Category = db.category;

exports.createCategory = (req,res)=>{
    Category.create({
        name: req.body.name,
        detail: req.body.detail
    }).then(category =>{
        res.status(200).send({
            result: category,
            success: true,
            message: 'Category is created'
        })
    }).catch(err =>{
        console.log(err.message);
    });
}