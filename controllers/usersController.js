const User = require("../models/userModel");

const getUsers = async (req, res) => {

    const users = await User.find().select("-password").lean();
    if(!users.length){
        return res.status(404).json({message: " No users found" });
    }
    res.json({users});
};

module.exports = {
    getUsers,
};