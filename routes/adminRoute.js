import express from "express"; // need to create a router for admin routes
import User from "../schema/User.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin dashboard route
router.get("/dashboard", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.send("Welcome to the Admin Dashboard");
});

router.get(
  "/allusers",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find({}, { username: 1, email: 1, _id: 0 });
      //const users = await User.find({}, "username email -_id");
      res.send(users);
    } catch (error) {
      res.status(500).json({ message: "Server error with the database" });
    }
  },
);
export default router;
