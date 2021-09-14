const db = require('../model');
const Services = db.services;

exports.createServices =(req,res)=>{
    Services.create({
        name: req.body.name,
        detail: req.body.detail,
        tag: req.body.tag
    }).then(services=>{
        res.status(200).send({
          result: services,
          success:true,
          message: 'Services is created'
    })       
        }).catch(err=>{
            console.log(err.message);
        });
  
}