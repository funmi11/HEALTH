const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOption = {
    origin: 'http//localhost:6000'
};
app.use(cors(corsOption));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

const db = require("./app/model");
const Role = db.role;

db.sequelize.sync({force: true}).then(()=>{
    console.log("all models are created");
    initial();
}).catch((err)=>{
    console.log(err.message);
});

require('./app/routes/auth.routes')(app);
require('./app/routes/category.routes')(app);
require('./app/routes/services.routes')(app);

const PORT = process.env.PORT || 4500;

app.get('/', (req, res)=>{
    res.send('welcome');
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`); 
});

function initial() {
    Role.create({
        id: 1,
        name: "admin"
    });

    Role.create({
        id: 2,
        name: "user"
    });
} 