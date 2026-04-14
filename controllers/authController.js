const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async(req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }
    const foundUser = await User.findOne({email});
    if(foundUser){
        return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });
        
    
    const accessToken = jwt.sign({
        userInfo:{
            id: user._id
        }
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"15m"});

    const refreshToken = jwt.sign({
        userInfo:{
            id: user._id
        }
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn:"7d"});
    
    res.cookie("jwt", refreshToken, {
        httpOnly: true,      
        secure: true,         
        sameSite: "None",     
        maxAge: 7*24*60*60*1000
      });
      
    res.json({
        accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
};

const login = async (req, res) =>{
    const { email, password} = req.body;
    if(!email || !password){
        return res.status(404).json({message: "there is a required filed."})
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message: "User not Found."});
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch){
        return res.status(401).json({message: "Wrong Password, please try again."});
    }  

    const accessToken = jwt.sign({
        userInfo:{
            id: user._id
        }
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"15m"});

    const refreshToken = jwt.sign({
        userInfo:{
            id: user._id
        }
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn:"7d"});
    
    res.cookie("jwt", refreshToken, {
        httpOnly: true,      
        secure: true,         
        sameSite: "None",     
        maxAge: 7*24*60*60*1000
      });
      
    res.json({
        user: {
            username: user.username,
            email: user.email
        },
        accessToken
    });
}

const refresh = (req, res) => {
    const cookies = req.cookies;
    if(!cookie.jwt){
        return res.status(401).json({message: "Unauthorized."});
    }
    const refreshToken = cookie.jwt;
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded)=>{
        if(err) return res.status(403).json({message: "Forbidden"});
        const foundUser = await User.findById(jwt.decoded.userInfo.id).exec();
        if(!foundUser) return res.status(401).json({message: "Unauthorized."});
        const accessToken = jwt.sign({
            userInfo:{
                id: foundUser._id
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"15m"});
        res.json({accessToken});
    })
};

const logout = (req, res) =>{
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); //No content
    res.clearCookie('jwt',
         {httpOnly: true, sameSite: 'None', secure: true});
    res.json({message: "Cookie cleared"});
};

module.exports = {
    register,
    login,
    refresh,
    logout
}