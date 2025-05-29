const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.get("/feed", async (req, res) => {
    const posts = await postModel.find().populate("user");
    res.render("feed", { posts });
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const { email, password, name, username, age } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).send("User already registered");

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            username,
            email,
            age,
            name,
            password: hash
        });

        const token = jwt.sign({ email: user.email, id: user._id }, "shhhh");
        res.cookie("token", token);
        res.send("Registered Successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Registration Failed");
    }
});

app.get("/profile", isLoggedIn, async (req, res) => {

    let user = await userModel.findOne({ email: req.user.email }).populate("post");
    res.render("profile", { user });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).send("Invalid email or password");

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).send("Invalid email or password");

        const token = jwt.sign({ email: user.email, id: user._id }, "shhhh");
        res.cookie("token", token);
        res.redirect('/profile');
        res.status(200);

    } catch (err) {
        console.error(err);
        res.status(500).send("Login failed");
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

// Protected route
app.post("/post", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
    let { content } = req.body;

    let post = await postModel.create({
        user: user._id,
        content
    }
    )

    user.post.push(post._id);
    await user.save();

    res.redirect('/profile');

});




// Auth middleware
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) return res.status(401).send("You must be logged in");

    try {
        const data = jwt.verify(token, "shhhh");
        req.user = data;
        next();
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
}

app.listen(port, () => {
    console.log(`Server running on port ${port} 🔥`);
});
