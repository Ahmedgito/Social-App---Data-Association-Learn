const express = require("express");
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;
const bodyParser = require("body-parser");
const userModel = require("./models/user");
const postModel = require("./models/post") ;
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

    let { email, password, name, username, age } = req.body;
    let user = await userModel.findOne({ email })

    if (user) return res.status(500).send("user already registered");
    if (!user) return res.status(500).send("Something went Wrong") ; 
    
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {

            let user = await userModel.create({
                username,
                email,
                age,
                name,
                password: hash
            })

            let token = jwt.sign({ email: email, username: user._id }, "shhhh")
            res.cookie("token" , token) ;
            res.send("Registered") ;
        })
    })

});

app.get("/login", (req, res) => {

    res.render("login");

});


app.listen(port, () => `Server running on port ${port} 🔥`);