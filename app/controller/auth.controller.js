const db = require("../model");
const config = require("../config/auth.config");
const User = db.user;
const Role =db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

var salt = bcrypt.genSaltSync(8);

exports.signupAdmin = (req, res) =>{
    User.create({
        email: req.body.email,
        password: bcrypt.hashSync(config.adminDefaultPassword, salt)
    }).then((user) =>{
        Role.findAll({
            where: {
                name: {
                    [Op.or]: ['admin']
                }
            }
        }).then(role => {
            const token = jwt.sign({id: user.id}, config.secret, {expiresIn: 86400 /*24 hours*/})
            user.setRoles(role).then(() =>{
                res.status(200).send({
                    success: true,
                    id: user.id,
                    email: user.email,
                    accessToken: token,
                    roles: role,

                    message: "Admin registered successfully"
                })
            });
        })
    }).catch(err =>{
        res.status(404).send({success: false, message: err.message})
    });
}
// exports.signUpCustomer = (req, res) =>{
//     User.create({
//         email: req.body.email,
//         password: bcrypt.hashSync(req.body.password,salt)
//     }).then((user) => {
//         Role.findAll({
//             where: {
//                 name: {
//                     [Op.or] : ['customer']
//                 }
//             }
//         }).then(roles => {
//          const token = jwt.sign({id: user.id}, config.secret,{expiresIn: 86400 /*24 hours*/})  
//             user.setRoles(roles).then(() => {
//                 res.status(200).send({
//                     success: true,
//                     result: {
//                     id: user.id,
//                     email: user.email,
//                     password: user.password,
//                     accessToken: token,
//                     roles: roles,
//                     },
//                     message: 'customer registered successfully',
//                 })
//             })
//         })
//     }).catch(err => {
//         res.status(500).send({message: err.message, success:false});

//     });
// }

exports.signin = (req, res) => {
    User.findOne({
      where: {
        [Op.or]:[
          {
            email: {[Op.eq]: req.body.param}
          },
          // {
          //   password: {[Op.eq]: req.body.param}
          // }
        ]
      }
    }).then(user => {
      console.log(user);
      if(!user || user == null){
        return res.status(200).send({message: "USER_NOT_FOUND", success: false});
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if(!passwordIsValid){
        return res.status(200).send({
          message: "Invalid Password",
          success: false,
          accessToken: null
        });
      }
        var token = jwt.sign({id: user.id}, config.secret,{
          expiresIn: 86400 //24 hours
        });
        var authorities = [];
        user.getRoles().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push({'name': roles[i].name});
          }
          res.status(200).send({
            success: true,
            id: user.id,
            email: user.email,
            password: user.password,
            accessToken: token,
            roles: authorities,
            accessToken: token
          });
        });
        
    }).catch(err => {
      return res.status(404).send({message: err.message, success: false});
    })
}
  
//updating password i.e modifying or changing the password

exports.UpdatePassword = (req, res) => {
    User.findOne({
      where: {
        id: req.userId
      }
    }).then(user => {
      if(!user){
        return res.status(200).send({message: "USER_NOT_FOUND", success: false});
      }
      console.log(req.body.oldPassword);
      console.log(user.password);
      var passwordIsValid = bcrypt.compareSync(
        req.body.oldPassword,
        user.password
      );
      if(!passwordIsValid){
        return res.status(200).send({message: 'Old password is incorrect!!!', success: false});
      }
      User.update({
        // email: user.email,
        password:  req.body.newPassword
      },
      {
        where: {
          id: parseInt(req.userId) /*req.body.userId*/
        }
      })
    }).catch(err => {
        res.status(404).send({message: 'unable to update password', success: false, err: err.message})
    })
}
