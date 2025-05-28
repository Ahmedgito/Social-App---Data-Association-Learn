const express = require("express");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser");
const userModel = require("./models/user");
const cookieParser = require("cookie-parser");
const app = express()
const port = process.env.PORT || 5000;


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", 'ejs');


app.get("/", (req, res) => {

    res.render("index");

});

app.post("/register", async (req, res) => {

    let { email, password, username, age } = req.body;
    let user = await userModel.findOne({ email })

    if (user) return res.status(500).send("user already registered");

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt , (err,hash) =>{
            console.log(hash); 
        })
    })

});


app.listen(port, () => `Server running on port ${port} 🔥`);