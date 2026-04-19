const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/**
 * 
 *@name registerUser
 *@description Controller function to register a new user
 *@route POST /api/auth/register
 *@access Public
 */


async function registerUserController(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    } 

    const isUserAlreadyExists = await userModel.findOne({ $or: [{ username }, { email }] });
    if (isUserAlreadyExists) {
        return res.status(400).json({ message: "Username or email already exists" });
    } 

    const hash=await bcrypt.hash(password, 10);
    const user = await userModel({ username, email, password: hash });
    await user.save();
    const token= jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.cookie("token", token);
    
    return res.status(201).json({ message: "User registered successfully", user: { id: user._id, username: user.username, email: user.email } });



    
}

/**
 * @name loginUser
 * @description Controller function to login a user
 * @route POST /api/auth/login
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;  
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token);
    return res.status(200).json({ message: "User logged in successfully", user: { id: user._id, username: user.username, email: user.email } });
}


/**
 *@name logoutUser
 * @description Controller function to logout a user
 * @route POST /api/auth/logout
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }
    await blacklistModel.create({ token });
    res.clearCookie("token");

    return res.status(200).json({ message: "User logged out successfully" });
}


async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ 
        message: "User details fetched successfully",
        user: { id: user._id, username: user.username, email: user.email } });
}

module.exports = { registerUserController , loginUserController, logoutUserController, getMeController};