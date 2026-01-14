const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const authenticated = require("../authentication/auth");

const router = express.Router();

/* SIGNUP */
router.post("/signup", async (req, res) => {
  console.log("routecalled")
  try {
    const { userName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({message:"user created successfully",
      id: user._id,
      userName: user.userName,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Signup failed", error });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      id: user._id,
      userName: user.userName,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});


router.get("/get-profile", authenticated,async(req, res)=>{
  let userId = req.user.id;
  try{
    let user = await User.findById(userId);
    res.status(200).json(user);
  }catch(err){
    console.log(err);
  }
})

router.get("/get-users", authenticated,async(req, res)=>{
  try{
    let user = await User.find();
    res.status(200).json(user);
  }catch(err){
    console.log(err);
  }
})

module.exports = router;
