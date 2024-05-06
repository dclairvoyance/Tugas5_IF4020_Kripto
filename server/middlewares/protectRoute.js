import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    // check if JWT token exists
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    // verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // check if user exists
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // set user in req
    req.user = user;
    next();
  } catch (error) {
    console.error(`Error in protect route middleware: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default protectRoute;
