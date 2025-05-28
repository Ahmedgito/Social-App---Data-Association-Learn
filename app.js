const express = require("express");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser");
const userModel = require("./models/user") ;
const cookieParser = require("cookie-parser");
const app = express()
const port = process.env.PORT || 5000;


app.use(express.json())
app.use(express.urlencoded({extended : true})) ;
app.use(cookieParser()) ;

app.set("view engine" , 'ejs') ; 


app.get("/", (req, res) => {
  
    res.render("index");

});

app.post("/create", (req, res) => {
  
});


app.listen(port, () => `Server running on port ${port} 🔥`);