import userModel from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { username: 1, email: 1, _id: 0 });
    res.send(users);
  } catch (error) {
    res.status(500).json({ message: "Server error with the database" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id, {
      username: 1,
      email: 1,
      role: 1,
      _id: 0,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ message: "Server error with the database" });
  }
};

